
<?php


require_once "../config/config.php";//外部ファイル読込

//JSからデータを受け取る処理
$rawData = file_get_contents("php://input");//JSから受け取った生のデータ（日本語）
error_log("[LinguaDiary]" . $rawData);
$data = json_decode($rawData, true);//JSONをPHP変数に変換（日本語）
$text = $data["text"];
$language = $data["language"];


//外部APIに渡すデータを連想配列で準備する
$postData = [
	"q" => $text,
	"target" => $language,
	"format" => "text"
];

$postJson = json_encode($postData);//外部APIに渡すために上の連想配列をJSON化

$curl = curl_init();//外部サービスを利用するためにデータの受け渡しをする箱を作る

curl_setopt($curl, CURLOPT_URL, "https://translate.googleapis.com/language/translate/v2");//送り先
curl_setopt($curl, CURLOPT_POST, true);//送る方法
curl_setopt($curl, CURLOPT_HTTPHEADER,
	[
		"Content-Type: application/json",
		"x-goog-api-key: " . $googleTranslationApiKey
	]
);//認証ヘッダー情報

curl_setopt($curl, CURLOPT_POSTFIELDS, $postJson);//送る本体
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);//返事を変数として受け取る準備

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$responseData = json_decode($response, true);
$translation = $responseData["data"]["translations"][0]["translatedText"];
	
echo json_encode($translation);//レスポンスをjsに返す



?>
