<?php

//jsからデータを受け取る処理

//①そのままのデータ（jsから送られたJSON文字列のデータ）の受け取り
$rawData = file_get_contents("php://input");
//②PHP変数（連想配列に送られたデータがある）に変換
$data = json_decode($rawData, true);

//③データの取り出し
$currentDiaryId = $data["currentDiaryId"];
$title = $data["title"];
$diaryDate = $data["diary_date"];
$diaryTime = $data["diary_time"];
$originalText = $data["original_text"];
$translatedText = $data["translated_text"];
$userId = $data["user_id"];

//④PDOでデータベース接続
$dsn = "mysql:host=localhost; dbname=linguadiary; charset=utf8mb4";

try {
  $pdo = new PDO(
    $dsn,"root","",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );
} catch (PDOException $e) {
  echo $e -> getMessage();
  exit;
}


//⑤INSERT分をprepare
if ($currentDiaryId === null) {
  $stmt = $pdo->prepare (
  "INSERT INTO diaries
  (user_id, title, diary_date, diary_time, original_text, translated_text)
  VALUES
  (:user_id, :title, :diary_date, :diary_time, :original_text, :translated_text)"
  );

} else {
  $stmt = $pdo->prepare (
    "UPDATE diaries SET 
    title = :title,
    original_text = :original_text,
    translated_text = :translated_text
    where id = :id"
  );
}


//⑥executeで値を入れて実行
if ($currentDiaryId === null) {
  $stmt->execute([
  ":user_id" => $userId,
  ":title" => $title,
  ":diary_date" => $diaryDate,
  ":diary_time" => $diaryTime,
  ":original_text" => $originalText,
  ":translated_text" => $translatedText
]);
} else {
  $stmt->execute([
    ":title" => $title,
    ":original_text" => $originalText,
    ":translated_text" => $translatedText,
    ":id" => $currentDiaryId
  ]);
}


//⑦JSに処理結果を通知

if ($currentDiaryId === null) {
  $response = [
    "success" => true,
    "action" => "created",
    "id" => $pdo->lastInsertId()
  ];
} else {
  $response = [
    "success" => true,
    "action" => "updated",
    "id" => $currentDiaryId
  ];
}



echo(json_encode($response));




?>