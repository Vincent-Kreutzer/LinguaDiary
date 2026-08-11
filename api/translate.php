<?php

//JSからデータを受け取る処理
$rawData = file_get_contents("php://input");//JSから受け取った生のデータ
$data = json_decode($rawData, true);//JSONをPHP変数に変換

$text = $data["text"];

$text_json = json_encode($text);//JSONエンコードでJSON化

echo($text_json);

?>
