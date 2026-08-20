
const diaryInput = document.querySelector(".diary-input");
const diaryOutput = document.querySelector(".diary-output");
const translateBtn = document.querySelector(".translate-btn");
const saveBtn = document.querySelector(".save-btn");
const diaryDate = document.querySelector(".diary-date");//日付
const diaryTime = document.querySelector(".diary-time");//時刻

const diaryList = document.querySelector(".diary-list");

const topBtn = document.querySelector(".top-btn");
const listBtn = document.querySelector(".list-btn");


//表示時間関数（日記を書き始めた日時を記録、表示）
function getCurrentDate() {
	const now = new Date();

	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const date = now.getDate();
	
	const hours = now.getHours();
	const minutes = now.getMinutes();

	const padMonth = String(month).padStart(2,"0");
	const padDate = String(date).padStart(2,"0");
	const padHours = String(hours).padStart(2,"0");
	const padMinutes = String(minutes).padStart(2,"0");

	diaryDate.value = `${year}-${padMonth}-${padDate}`;
	diaryTime.value = `${padHours}:${padMinutes}`;
	
}


//翻訳ボタンイベント付与
translateBtn.addEventListener("click", () => {
	const target = diaryInput.value;//翻訳対象を変数に入れ、
	console.log(target);
	getTranslation(target);//翻訳関数実行
})

//翻訳関数
async function getTranslation(target) {
	try	{
		const response = await fetch ("api/translate.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"		
			},
			body: JSON.stringify({text: target})
		})

		const data = await response.json();	
		diaryOutput.textContent = data;
	} catch (e) {
		console.error(e);
	}
}


//保存ボタンイベント付与
saveBtn.addEventListener("click", () => {
	console.log("clicked save button");
	saveDiary();
})


//DBへの日記保存処理
async function saveDiary() {

	//保存する情報を取得
	const title = document.querySelector(".diary-title").value;
	const diaryDate = document.querySelector(".diary-date").value;
	const diaryTime = document.querySelector(".diary-time").value;
	const originalText = document.querySelector(".diary-input").value;
	const translatedText = document.querySelector(".diary-output").textContent;
	const userId = 1;

	//保存データをオブジェクトに入れて一纏めにする
	const diaryData = {
		title:title,
		diary_date:diaryDate,
		diary_time:diaryTime,
		original_text:originalText,
		translated_text:translatedText,
		user_id:userId
	};

	//送信処理
	try {
		const response = await fetch ("api/save.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/JSON",
			},
			body: JSON.stringify(diaryData)
				
		})
	
	console.log(response.status);
	const data = await response.json();
	console.log(data);
	if (data.sucess) {
		alert("Saved!");
	}
	} catch (e) {
		console.log(e.error);
	}

}//saveDiary()




//日記データ取得と表示を統括する関数
async function initDiaries() {
	const diaryArray = await getDiaries();
	console.log(diaryArray);
	await renderDiaries(diaryArray);	
}


//日記一覧データ取得のための非同期処理
async function getDiaries() {
	try {
		const response = await fetch ("api/getDiaries.php", {
			method: "GET"
		});
		const data = await response.json();
		return data;
	} catch ($e) {
		console.log($e.error);
	}
	
}//getDiaries()


//日記データ表示
listBtn.addEventListener("click", () => {
	diaryList.classList.toggle("hidden");
})

//日記データrender関数
function renderDiaries(diaryArray) {
	const diaries = diaryArray;
	

	diaries.forEach(diary => {		
		//日記見出し表示欄に各日記の日付と題名を表示する

		const diaryItem = document.createElement("div");
		diaryItem.classList.add("diary-item");
		diaryList.appendChild(diaryItem);

		const diaryDate = document.createElement("span");
		diaryDate.classList.add("diary-date");
		diaryDate.textContent = diary.diary_date;
		diaryItem.appendChild(diaryDate);

		const diaryTitle = document.createElement("p");
		diaryTitle.classList.add("diary-title");
		diaryTitle.textContent = diary.title;
		diaryItem.appendChild(diaryTitle);
		

	})
}


document.addEventListener("DOMContentLoaded", () => {
	getCurrentDate();
	initDiaries();
})

