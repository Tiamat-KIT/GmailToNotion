function getLabeledMailData(labelName) {
  // ラベルオブジェクトを取得
  var label = GmailApp.getUserLabelByName(labelName);
  
  // ラベルに紐づくスレッドを取得
  var threads = label.getThreads();
  
  // 取得したメールデータの配列を初期化
  var mailData = [];
  
  // スレッドごとに処理を実行
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    
    // スレッド内のメールを取得
    var messages = thread.getMessages();
    
    // メールごとに処理を実行
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      
      // メールデータを配列に格納
      mailData.push({
        subject: message.getSubject(),
        from: message.getFrom(),
        to: message.getTo(),
        body: message.getBody(),
        date: message.getDate(),
        id: message.getId()
      });
    }
  }
  
  // 取得したメールデータの配列を返す
  return mailData;
}

function getNotionData() {
  const database_id = '[database_id]';
  const url = 'https://api.notion.com/v1/databases/' + database_id + '/query';
  const token = 'secret_***';

  let headers = {
    'content-type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + token,
    'Notion-Version': '2022-06-28',
  };

  let options = {
    'method': 'post',
    'headers': headers,
    // "muteHttpExceptions": true
  };

  let notion_data = UrlFetchApp.fetch(url, options);
  notion_data = JSON.parse(notion_data);

  const properties = notion_data.results.map((data) => {
    return data.properties // ["メールID"]["rich_text"][0]["text"]["content"] : これでメールのIDを表示する
  })
  return properties
}

function main(){
  const Duda = getLabeledMailData("duda新卒エージェント")
  const notion_result = getNotionData()
  const notion_result_Ids = notion_result.map((data) => {
    return data["メールID"]["rich_text"][0]["text"]["content"]
  })

  if(notion_result_Ids.length == 0){
    Logger.log("Notion内に全くデータがありませんでした")
    Duda.forEach((data) => {
      Notion_Post(data,"duda新卒エージェント")
    })
  }else {
    Logger.log("データベースにいくつかのデータが見つかりました")
    Duda.forEach((data) => {
      if(notion_result_Ids.indexOf(data.id) >= 0){
        Logger.log("このデータは投稿すべきでない " + data.id)
      }else {
        Notion_Post(data,"duda新卒エージェント")
      }
    })
  }
}

function Notion_Post(Mail,label){
  const database_id = '[database_id]';
  const url = 'https://api.notion.com/v1/databases/' + database_id + '/query';
  const token = 'secret_***';
  const json_data = {
      "parent": { "database_id": database_id},
      "properties":{
        "名前": {
          "title":[
            {
              "text": {
                "content": Mail.subject
              }
            }
          ]
        },
        "タグ": {
          "select":{
            "name": label,
            "color": "blue"
          }
        },
        "メールID":{
          "rich_text": [
            {
              "text": {
                "content": Mail.id
              }
            }
          ]
        },
        "対応済": {
          "checkbox":false
        },
        "日付": {
          "date":{
            "start": Mail.date,
            "end": null
          }
        }
      },
      "children": [
        {
          "object": "block",
          "type": "paragraph",
          "paragraph":{
            "rich_text": [
              {
                "text": {
                  "content": Mail.body
                }
              }
            ]
          }
        }
      ]
    }

  UrlFetchApp.fetch(url,{
    "method": "post",
    "headers": {
      'content-type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + token,
      'Notion-Version': '2022-06-28',
    },
    "payload": JSON.stringify(json_data)
  })

}
