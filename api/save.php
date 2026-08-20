<?php

//jsからデータを受け取る処理

//①そのままのデータ（jsから送られたJSON文字列のデータ）の受け取り
$rawData = file_get_contents("php://input");
//②PHP変数（連想配列に送られたデータがある）に変換
$data = json_decode($rawData, true);

//③データの取り出し
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
$stmt = $pdo->prepare (
  "INSERT INTO diaries
  (user_id, title, diary_date, diary_time, original_text, translated_text)
  VALUES
  (:user_id, :title, :diary_date, :diary_time, :original_text, :translated_text)"
  );

//⑥executeで値を入れて実行
$stmt->execute([
  ":user_id" => $userId,
  ":title" => $title,
  ":diary_date" => $diaryDate,
  ":diary_time" => $diaryTime,
  ":original_text" => $originalText,
  ":translated_text" => $translatedText
]);

//⑦JSに送信結果を通知
$response = [
  "success" => true,
  "id" => $pdo->lastInsertId()
];

echo(json_encode($response));
?>