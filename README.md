# GmailToNotion
GmailできたメールをNotionでまとめます

## 今考えている使い道
## 就活エージェントのメール多すぎる...何とかして整理したい
### 実行手順
1. まず、Notionのデータベースを作成します。
2. 以下のテーブルを定義します

|メールの件名|エージェント企業名|対応期限|
| ---- | ---- | ---- |
|テキスト|セレクト|日付|

3. NotionのAPIKEYを作成します
4. NotionのデータベースIDを取得し、データベースURLを保管しておく
5. スクリプトプロパティにAPI_KEYとデータベースURLを登録する
6. 以下の内容を保存できるようにプログラムを書く。

| メールの件名 | エージェント企業名 | 対応期限 |
| ---- | ---- | ---- |
| Gmailのメールの件名 | 送付主のドメインから判別した結果 | ここは手入力とする（いったん） |

7. 定期実行させる

### 環境変数設定
- API_URL : Notion APIにおいて、取得を行うための基礎的なURL
- DATABASE_ID : NotionのデータベースのID
- NOTION_KEY : Notion APIを使う上の鍵

全て、

```javascript
PropertiesService.getScriptProperties().getProperty(値に対応する名前)
```

で取得可能
