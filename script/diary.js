
/*============================
=====DOM取得と主要変数定義=====
=============================*/

const diaryTitle = document.querySelector(".diary-title");
const diaryDate = document.querySelector(".diary-date");//日付
const diaryTime = document.querySelector(".diary-time");//時刻
const diaryInput = document.querySelector(".diary-input");
const diaryOutput = document.querySelector(".diary-output");
const languageSelect = document.querySelector(".language-select");
const diaryList = document.querySelector(".diary-list");//リスト表示欄
const diaryListClose = document.querySelector(".diary-list-close");
const diaryListItems = document.querySelector(".diary-list-items")

const newBtn = document.querySelectorAll(".new-btn");
const listBtn = document.querySelectorAll(".list-btn");
const logoutBtn = document.querySelectorAll(".logout-btn");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

const actionArea = document.querySelector(".action-area");
const translateBtn = document.querySelector(".translate-btn");
const speechBtn = document.querySelector(".speech-btn");
const saveBtn = document.querySelector(".save-btn");
const saveBtnText = document.querySelector(".save-btn-text");
const deleteBtn = document.querySelector(".delete-btn");
let currentDiaryId = null; //日記を編集や削除する際に参照する

/*=====================
=====ページ表示関係=====
======================*/

menuToggle.addEventListener("click", () => {
	mobileMenu.classList.toggle("hidden");
})

/*=====================
=====ページ保護機能=====
======================*/

//ログイン状態を確認
async function checkLogin() {
	try {
		const response = await fetch ("api/isLogin.php", {
			method: "GET"
		})
		const data = await response.json();
		if (data.success === true) {
			console.log("You are currently logged in.");
		} else {
			console.log("You are not logged in. Redirecting to the top page.");
			location.href = "index.html";
		}
 	}	catch (e) {
	console.log(e)
	}
}

//ログアウト機能
async function logoutDiary() {
	try {
		const response = await fetch("api/logout.php", {
			method: "GET"
		});

		const data = await response.json();
		if (data.success === true) {
			alert("You have successfully logged out.");
			location.href = "index.html";
		}
	} catch (e) {
		console.log(e);
	}
}

logoutBtn.forEach((btn) => {
		btn.addEventListener("click", () => {
			menuToggle.classList.add("hidden");
			logoutDiary();
		});
})



/*====================
=====新規日記作成=====
======================*/



//表示項目を初期状態に戻す
function resetDiaryForm() {
	getCurrentDate();
	diaryTitle.value = "";	
	diaryInput.value = "";
	diaryOutput.value = "";
	currentDiaryId = null;
	updateDiaryMode();
}

newBtn.forEach((btn) => {	
	btn.addEventListener("click", () => {
		mobileMenu.classList.add("hidden");
		resetDiaryForm;
	});
})

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
	const target = {
		text: diaryInput.value,
		language: languageSelect.value
	}

	console.log(target);
	getTranslation(target);//翻訳関数実行
})


//翻訳関数⇒PHPへ翻訳データ依頼
async function getTranslation(target) {
	if (!diaryInput.value.trim()) {
		alert("Please write your diary entry first.")
		return;
	}
	try	{
		const response = await fetch ("api/translate.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"		
			},
			body: JSON.stringify(target)
		})

		const data = await response.json();	
		diaryOutput.value = data;
		console.log(data);
		//diaryOutput.value = data;
	} catch (e) {
		console.error(e);
	}
}


function speakTranslation() {
	const text = diaryOutput.value;
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = "en-US";
	speechSynthesis.speak(utterance);
}

//音読ボタンイベント
speechBtn.addEventListener("click", () => {
	speakTranslation();
})

//保存ボタンイベント付与
saveBtn.addEventListener("click", async () => {
	if (!diaryInput.value.trim()) {		
		alert("Please write your diary entry first.")
		return;
	} 
	
	const target = diaryInput.value;//翻訳対象を変数に入れる

 	if (!diaryOutput.value.trim())	{		
		await getTranslation(target);
	}
		
	console.log("clicked save button");
	await saveDiary();
	resetDiaryForm();
})


//DBへの日記保存（更新）処理
async function saveDiary() {

	//保存する情報を取得
	const title = document.querySelector(".diary-title").value;
	const diaryDate = document.querySelector(".diary-date").value;
	const diaryTime = document.querySelector(".diary-time").value;
	const originalText = document.querySelector(".diary-input").value;
	const translatedText = document.querySelector(".diary-output").value;
	

	//保存データをオブジェクトに入れて一纏めにする
	const diaryData = {
		currentDiaryId : currentDiaryId,
		title:title,
		diary_date:diaryDate,
		diary_time:diaryTime,
		original_text:originalText,
		translated_text:translatedText,
		
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
	
	
	if (data.success) {
		if (data.action === "created") {
			alert("The diary entry was successfully saved.");
			resetDiaryForm();
			initDiaries();
		} else {
			alert("The diary entry was successfully updated.");
			resetDiaryForm();
			initDiaries();

		}
	}

	} catch (e) {
		console.log(e.error);
	}

}//saveDiary()


/*===================
=====日記一覧表示=====
====================*/

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

//日記データrender関数
function renderDiaries(diaryArray) {
	diaryListItems.innerHTML = "";
	const diaries = diaryArray;
	
	diaries.forEach(diary => {		
		//日記見出し表示欄に各日記の日付と題名を表示する

		const diaryItem = document.createElement("div");
		diaryItem.classList.add("diary-item");
		diaryItem.dataset.diaryId = diary.id;

		diaryItem.addEventListener("click", () => {
			currentDiaryId = diary.id;
			updateDiaryMode();

			console.log(currentDiaryId)
			diaryDate.value = diary.diary_date;
			diaryTime.value = diary.diary_time;
			diaryTitle.value = diary.title;
			diaryInput.value = diary.original_text;
			diaryOutput.value = diary.translated_text;

			diaryList.classList.toggle("hidden");			

		})

		diaryListItems.appendChild(diaryItem);

		const listDate = document.createElement("span");
		listDate.classList.add("list-date");
		listDate.textContent = diary.diary_date;
		diaryItem.appendChild(listDate);

		const listTitle = document.createElement("p");
		listTitle.classList.add("list-title");
		listTitle.textContent = diary.title;
		diaryItem.appendChild(listTitle);
		

	})
}//renderDiaries();

//リストを閉じるイベント
diaryListClose.addEventListener("click", () => {
	diaryList.classList.add("hidden");
})

/*======================
=====既存日記の削除=====
=======================*/

deleteBtn.addEventListener("click", async () => {
	
	const confirmed = confirm("Are you sure you want to delete the diary entry?");
	if (!confirmed) return;
	try {
		const response = await fetch("api/delete.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				currentDiaryId: currentDiaryId
			})
		})

		const data = await response.json();

		if (data.success) {
			alert("The diary was successfully deleted.");
			resetDiaryForm();
			initDiaries();
			
		} else {
			alert("The deletion process failed.")
			
		}
	} catch ($e) {
		console.log($e.error);
	}
});


//listBtnのイベント付与：一覧の表示非表示切り替え
listBtn.forEach((btn) => {
	btn.addEventListener("click", () => {	
		mobileMenu.classList.add("hidden");
		toggleDiaryList();
	});
})


//一覧の表示非表示切り替え
function toggleDiaryList() {
	diaryList.classList.toggle("hidden");
}

//状態によるボタンの表示非表示
function updateDiaryMode() {
	if (currentDiaryId === null) {
		deleteBtn.classList.add("hidden");
		actionArea.classList.add("three-btns");//delete非表示で3ボタンレイアウト
		saveBtnText.textContent = "SAVE";
	} else {
		deleteBtn.classList.remove("hidden");
		actionArea.classList.remove("three-btns");
		saveBtnText.textContent = "UPDATE";
	}
}



document.addEventListener("DOMContentLoaded", () => {
	checkLogin()
	getCurrentDate();
	initDiaries();
	updateDiaryMode();
	

})

