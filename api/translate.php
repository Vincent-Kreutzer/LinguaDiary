
<?php
//★★★チャットGPTにファイル丸ごと送るの厳禁！！★★★

require_once "../config/config.php";//外部ファイル読込
//JSからデータを受け取る処理
$rawData = file_get_contents("php://input");//JSから受け取った生のデータ（日本語）
$data = json_decode($rawData, true);//JSONをPHP変数に変換（日本語）
$text = $data["text"];


//外部APIに渡すデータを連想配列で準備する
$postData = [
	"text" => [$text],
	"target_lang" => "EN"
];

$postJson = json_encode($postData);//外部APIに渡すために上の連想配列をJSON化

$curl = curl_init();//外部サービスを利用するためにデータの受け渡しをする箱を作る

curl_setopt($curl, CURLOPT_URL, "https://api-free.deepl.com/v2/translate");//送り先
curl_setopt($curl, CURLOPT_POST, true);//送る方法
curl_setopt($curl, CURLOPT_HTTPHEADER,
	[
		"Content-Type: application/json",
		"Authorization: DeepL-Auth-Key " . $deeplApiKey
	]
);//ヘッダー・認証情報
curl_setopt($curl, CURLOPT_POSTFIELDS, $postJson);//送るもの
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);//返事を変数として受け取る準備

$response = curl_exec($curl);
$responseData = json_decode($response, true);
$translation = $responseData
	["translations"]
	[0]
	["text"];
$translationJson = json_encode($translation);

echo($translationJson);//レスポンスをjsに返す



?>
