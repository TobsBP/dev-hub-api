# Integração Spring Boot com SharePoint — Tutorial Completo

Este tutorial cobre todo o fluxo de integração entre uma aplicação Java com Spring Boot e o SharePoint, incluindo autenticação via Azure, upload de arquivos para pastas específicas, verificação e criação automática de pastas, e salvamento local simultâneo.

---

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Configuração no Azure Active Directory](#2-configuração-no-azure-active-directory)
3. [Dependências Maven](#3-dependências-maven)
4. [Configuração da Aplicação](#4-configuração-da-aplicação)
5. [Classe de Propriedades](#5-classe-de-propriedades)
6. [Verificação e Criação de Pastas](#6-verificação-e-criação-de-pastas)
7. [Service — Upload Local e SharePoint](#7-service--upload-local-e-sharepoint)
8. [Controller](#8-controller)
9. [Fluxo Completo](#9-fluxo-completo)
10. [Tratamento de Erros](#10-tratamento-de-erros)
11. [Dicas de Otimização](#11-dicas-de-otimização)
12. [Pontos Importantes](#12-pontos-importantes)

---

## 1. Pré-requisitos

Você não precisa ser administrador do SharePoint, mas um **administrador precisa realizar a configuração no Azure uma única vez** e te fornecer as credenciais.

As permissões mínimas necessárias no Azure são:

| Permissão | Tipo | Finalidade |
|---|---|---|
| `Files.ReadWrite.All` | Application | Upload e leitura de arquivos |
| `Sites.ReadWrite.All` | Application | Acesso aos sites SharePoint |

---

## 2. Configuração no Azure Active Directory

Um administrador deve realizar os seguintes passos no [portal do Azure](https://portal.azure.com):

1. Acessar **Azure Active Directory → App registrations → New registration**
2. Dar um nome ao app (ex: `spring-sharepoint-app`)
3. Em **API permissions**, adicionar as permissões `Files.ReadWrite.All` e `Sites.ReadWrite.All` do tipo **Application**
4. Em **Certificates & secrets**, criar um novo **Client Secret** e anotar o valor
5. Copiar o **Application (client) ID** e o **Directory (tenant) ID** da tela de visão geral

Ao final, você receberá três credenciais:

```
TENANT_ID     = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLIENT_ID     = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLIENT_SECRET = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Descobrindo o Site ID e Drive ID

Com as credenciais em mãos, faça as seguintes chamadas para descobrir os IDs do SharePoint:

```bash
# 1. Obtém o token de acesso
curl -X POST https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token \
  -d "client_id={CLIENT_ID}" \
  -d "client_secret={CLIENT_SECRET}" \
  -d "scope=https://graph.microsoft.com/.default" \
  -d "grant_type=client_credentials"

# 2. Busca o Site ID (use o token obtido acima)
curl -H "Authorization: Bearer {TOKEN}" \
  "https://graph.microsoft.com/v1.0/sites?search=nome-do-site"

# 3. Busca o Drive ID
curl -H "Authorization: Bearer {TOKEN}" \
  "https://graph.microsoft.com/v1.0/sites/{SITE_ID}/drives"
```

---

## 3. Dependências Maven

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Microsoft Graph SDK -->
    <dependency>
        <groupId>com.microsoft.graph</groupId>
        <artifactId>microsoft-graph</artifactId>
        <version>6.9.0</version>
    </dependency>

    <!-- Azure Identity para autenticação -->
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.11.1</version>
    </dependency>

    <!-- Lombok (opcional) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

---

## 4. Configuração da Aplicação

### `application.yml`

```yaml
microsoft:
  tenant-id: SEU_TENANT_ID
  client-id: SEU_CLIENT_ID
  client-secret: SEU_CLIENT_SECRET
  sharepoint:
    site-id: SEU_SITE_ID
    drive-id: SEU_DRIVE_ID
    pastas:
      contratos: "Documentos/Juridico/Contratos"
      relatorios: "Documentos/Financeiro/Relatorios"
      rh: "RH/Funcionarios/Documentos"
      notas-fiscais: "Financeiro/NotasFiscais/2024"

spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
```

> **Atenção:** nunca suba credenciais para o repositório. Use variáveis de ambiente em produção:
> ```yaml
> microsoft:
>   tenant-id: ${MICROSOFT_TENANT_ID}
>   client-id: ${MICROSOFT_CLIENT_ID}
>   client-secret: ${MICROSOFT_CLIENT_SECRET}
> ```

---

## 5. Classe de Propriedades

```java
@Configuration
@ConfigurationProperties(prefix = "microsoft")
@Data
public class MicrosoftProperties {
    private String tenantId;
    private String clientId;
    private String clientSecret;
    private Sharepoint sharepoint = new Sharepoint();

    @Data
    public static class Sharepoint {
        private String siteId;
        private String driveId;
        private Map<String, String> pastas = new HashMap<>();
    }
}
```

---

## 6. Verificação e Criação de Pastas

Este é o núcleo da automação: antes de fazer o upload, o sistema verifica **nível por nível** se cada pasta do caminho existe. Caso não exista, ela é criada automaticamente.

### Como funciona

Para o caminho `Documentos/Juridico/Contratos`:

```
Verifica "Documentos"                    → existe   → segue
Verifica "Documentos/Juridico"           → existe   → segue
Verifica "Documentos/Juridico/Contratos" → não existe → cria → segue
Upload ──► Documentos/Juridico/Contratos/arquivo.pdf ✅
```

### SharePointFolderService

```java
@Service
@RequiredArgsConstructor
public class SharePointFolderService {

    // Cache local para evitar chamadas repetidas à API
    private final Set<String> pastasVerificadas =
        Collections.synchronizedSet(new HashSet<>());

    public void garantirPastaExiste(
        GraphServiceClient graphClient,
        String siteId,
        String driveId,
        String caminhoPasta
    ) {
        if (pastasVerificadas.contains(caminhoPasta)) {
            return; // Já verificado nesta execução, pula as chamadas à API
        }

        String[] partes = caminhoPasta.split("/");
        StringBuilder caminhoAtual = new StringBuilder();

        for (String parte : partes) {
            if (caminhoAtual.length() > 0) caminhoAtual.append("/");
            caminhoAtual.append(parte);

            boolean existe = pastaExiste(graphClient, siteId, driveId, caminhoAtual.toString());

            if (!existe) {
                criarPasta(graphClient, siteId, driveId, caminhoAtual.toString(), parte);
                System.out.println("Pasta criada: " + caminhoAtual);
            } else {
                System.out.println("Pasta já existe: " + caminhoAtual);
            }
        }

        pastasVerificadas.add(caminhoPasta);
    }

    private boolean pastaExiste(
        GraphServiceClient graphClient,
        String siteId,
        String driveId,
        String caminho
    ) {
        try {
            graphClient
                .sites()
                .bySiteId(siteId)
                .drives()
                .byDriveId(driveId)
                .items()
                .byDriveItemId("root")
                .itemWithPath(caminho)
                .get();

            return true;

        } catch (ODataError e) {
            if (e.getError() != null &&
                "itemNotFound".equals(e.getError().getCode())) {
                return false;
            }
            throw new RuntimeException("Erro ao verificar pasta: " + caminho, e);
        }
    }

    private void criarPasta(
        GraphServiceClient graphClient,
        String siteId,
        String driveId,
        String caminhoCompleto,
        String nomePasta
    ) {
        String caminhoPai = caminhoCompleto.contains("/")
            ? caminhoCompleto.substring(0, caminhoCompleto.lastIndexOf("/"))
            : "";

        DriveItem novaPasta = new DriveItem();
        novaPasta.setName(nomePasta);
        novaPasta.setFolder(new Folder());

        try {
            if (caminhoPai.isEmpty()) {
                graphClient
                    .sites()
                    .bySiteId(siteId)
                    .drives()
                    .byDriveId(driveId)
                    .items()
                    .byDriveItemId("root")
                    .children()
                    .post(novaPasta);
            } else {
                graphClient
                    .sites()
                    .bySiteId(siteId)
                    .drives()
                    .byDriveId(driveId)
                    .items()
                    .byDriveItemId("root")
                    .itemWithPath(caminhoPai)
                    .children()
                    .post(novaPasta);
            }

        } catch (ODataError e) {
            // Criação em paralelo: ignora com segurança
            if (e.getError() != null &&
                "nameAlreadyExists".equals(e.getError().getCode())) {
                System.out.println("Pasta já foi criada em paralelo: " + caminhoCompleto);
            } else {
                throw new RuntimeException("Erro ao criar pasta: " + caminhoCompleto, e);
            }
        }
    }
}
```

---

## 7. Service — Upload Local e SharePoint

```java
@Service
@RequiredArgsConstructor
public class FileService {

    private final MicrosoftProperties props;
    private final SharePointFolderService folderService;

    private final Path pastaLocal = Paths.get("/var/www/uploads");

    private GraphServiceClient buildGraphClient() {
        ClientSecretCredential credential = new ClientSecretCredentialBuilder()
            .tenantId(props.getTenantId())
            .clientId(props.getClientId())
            .clientSecret(props.getClientSecret())
            .build();

        return new GraphServiceClient(credential,
            new String[]{ "https://graph.microsoft.com/.default" });
    }

    public Map<String, String> processarArquivo(
        MultipartFile file,
        String destino
    ) throws IOException {

        // Valida tipo de arquivo
        List<String> tiposPermitidos =
            List.of("image/png", "image/jpeg", "application/pdf",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        if (!tiposPermitidos.contains(file.getContentType())) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido: "
                + file.getContentType());
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        byte[] bytes = file.getBytes();

        // Busca o caminho mapeado no yml; usa "Documentos/Geral" como fallback
        String caminhoPasta = props.getSharepoint()
            .getPastas()
            .getOrDefault(destino, "Documentos/Geral");

        // Organiza por ano e mês automaticamente (opcional)
        String mes = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        String caminhoFinal = caminhoPasta + "/" + mes;

        GraphServiceClient graphClient = buildGraphClient();
        String siteId  = props.getSharepoint().getSiteId();
        String driveId = props.getSharepoint().getDriveId();

        // 1. Garante que todas as pastas do caminho existem
        folderService.garantirPastaExiste(graphClient, siteId, driveId, caminhoFinal);

        // 2. Salva localmente
        String urlLocal = salvarLocal(bytes, fileName);

        // 3. Sobe para o SharePoint
        String urlSharePoint = subirParaSharePoint(
            graphClient, siteId, driveId, bytes, fileName, caminhoFinal);

        return Map.of(
            "fileName", fileName,
            "pasta", caminhoFinal,
            "urlLocal", urlLocal,
            "urlSharePoint", urlSharePoint
        );
    }

    private String salvarLocal(byte[] bytes, String fileName) throws IOException {
        Path destino = pastaLocal.resolve(fileName);
        Files.write(destino, bytes);
        return "https://seudominio.com/uploads/" + fileName;
    }

    private String subirParaSharePoint(
        GraphServiceClient graphClient,
        String siteId,
        String driveId,
        byte[] bytes,
        String fileName,
        String caminhoPasta
    ) {
        String caminhoCompleto = caminhoPasta + "/" + fileName;

        DriveItem item = graphClient
            .sites()
            .bySiteId(siteId)
            .drives()
            .byDriveId(driveId)
            .items()
            .byDriveItemId("root")
            .itemWithPath(caminhoCompleto)
            .content()
            .put(bytes);

        return item.getWebUrl();
    }
}
```

---

## 8. Controller

```java
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
        @RequestParam("file") MultipartFile file,
        @RequestParam("destino") String destino
    ) {
        try {
            Map<String, String> resultado = fileService.processarArquivo(file, destino);
            return ResponseEntity.ok(resultado);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("erro", e.getMessage()));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("erro", "Falha ao processar o arquivo: " + e.getMessage()));
        }
    }
}
```

---

## 9. Fluxo Completo

```
Requisição POST /api/files/upload
        │
        ▼
Valida tipo do arquivo
        │
        ▼
Resolve caminho da pasta (yml + ano/mês)
        │
        ▼
Verifica pasta nível por nível no SharePoint
        │
        ├── Nível existe   ──► segue
        └── Nível não existe ──► cria ──► segue
        │
        ▼
Salva arquivo em /var/www/uploads/  ──► URL local
        │
        ▼
Sobe arquivo para SharePoint        ──► URL SharePoint
        │
        ▼
Retorna JSON com fileName, pasta, urlLocal, urlSharePoint
```

---

## 10. Tratamento de Erros

| Código Graph API | Significado | Ação tomada |
|---|---|---|
| `itemNotFound` | Pasta não existe | Cria a pasta automaticamente |
| `nameAlreadyExists` | Criação em paralelo | Ignora, usa a pasta existente |
| `accessDenied` | Sem permissão | Lança exceção — verificar permissões no Azure |
| `quotaLimitReached` | Storage cheio | Lança exceção — avisar o administrador |
| `invalidRequest` | Caminho inválido | Lança exceção — verificar o caminho configurado |

---

## 11. Dicas de Otimização

### Upload em sessão para arquivos grandes (acima de 4MB)

```java
// Para arquivos grandes, use upload session em vez de put direto
UploadSession uploadSession = graphClient
    .sites()
    .bySiteId(siteId)
    .drives()
    .byDriveId(driveId)
    .items()
    .byDriveItemId("root")
    .itemWithPath(caminhoCompleto)
    .createUploadSession()
    .post(new CreateUploadSessionPostRequestBody());

// Envia em partes de 5MB
LargeFileUploadTask<DriveItem> uploadTask =
    new LargeFileUploadTask<>(uploadSession, graphClient,
        new ByteArrayInputStream(bytes), bytes.length,
        DriveItem::createFromDiscriminatorValue);

uploadTask.upload();
```

### Cache de pastas verificadas

O `Set<String> pastasVerificadas` no `SharePointFolderService` evita que o mesmo caminho seja verificado múltiplas vezes durante a execução da aplicação, reduzindo chamadas desnecessárias à API do Microsoft Graph.

### Organização automática por data

```java
// Gera subcaminho: Documentos/Juridico/Contratos/2024/05
String mes = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
String caminhoFinal = caminhoPasta + "/" + mes;
```

---

## 12. Pontos Importantes

| Tópico | Detalhe |
|---|---|
| **Credenciais** | Nunca exponha `CLIENT_SECRET` no frontend ou no repositório |
| **Permissão mínima** | `Files.ReadWrite.All` já é suficiente para upload e leitura |
| **Pasta fallback** | Se o `destino` não existir no yml, o arquivo vai para `Documentos/Geral` |
| **Arquivos grandes** | Para arquivos acima de 4MB use upload session |
| **Cache de pastas** | O `Set` em memória evita chamadas repetidas à API |
| **Tipos permitidos** | Sempre valide o `ContentType` antes de processar |
| **Variáveis de ambiente** | Use `${VAR}` no yml e defina as variáveis no servidor de produção |

---

## Exemplo de Requisição

```bash
# Enviando um contrato para a pasta Documentos/Juridico/Contratos/2024/05
curl -X POST http://seudominio.com/api/files/upload \
  -F "file=@contrato.pdf" \
  -F "destino=contratos"
```

## Exemplo de Resposta

```json
{
  "fileName": "a1b2c3_contrato.pdf",
  "pasta": "Documentos/Juridico/Contratos/2024/05",
  "urlLocal": "https://seudominio.com/uploads/a1b2c3_contrato.pdf",
  "urlSharePoint": "https://empresa.sharepoint.com/sites/meusite/Documentos/Juridico/Contratos/2024/05/a1b2c3_contrato.pdf"
}
```
