const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-conatiner").classList.add("hidden");
  } else {
    document.getElementById("word-conatiner").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const lavelData = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((data) => lavelsData(data.data));
};

const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lession-active");
  lessonBtn.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lession-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

const loadWordDatail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const datils = await res.json();
  displayWordDatail(datils.data);
};

const displayWordDatail = (word) => {
  console.log(word);
  const detailBox = document.getElementById("details-container");
  detailBox.innerHTML = `<div class="">
            <h2 class="text-2xl font-bold"> ${word.word}
             ( <i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})
            </h2>
          </div>
          <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div class="">
            <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
            <div>
              ${createElements(word.synonyms)}
            </div>
          </div>`;
  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  const wordContanier = document.getElementById("word-conatiner");
  wordContanier.innerHTML = "";
  if (words.length === 0) {
    wordContanier.innerHTML = `
      <div class="text-center col-span-full rounded-xl space-y-5 py-10">
        <img class="mx-auto" src="/assets/alert-error.png"/>
        <p class="text-xl font-medium text-gray-400 font-bangla">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="text-2xl font-medium font-bangla">
          নেক্সট Lesson এ যান
        </h2>
      </div>
     `;
    manageSpinner(false);
    return;
  }
  words.forEach((word) => {
    console.log(word.id);
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
      <div
        class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4"
      >
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
        <p class="font-semibold">Meaning / Pronunciation</p>
        <div class="font-bangla text-2xl font-medium">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"}</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDatail('${word.id}')" class="btn bg-[#1A91FF10] hover:bg-[#00BCFF] hover:text-white">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button class="btn hover:bg-[#00BCFF] hover:text-white">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `;

    wordContanier.appendChild(wordCard);
  });
  manageSpinner(false);
};

const lavelsData = (lessons) => {
  const lessonContainer = document.getElementById("lavelContainer");
  //   lessonContainer.innerHTML = "";
  for (let lession of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
       <button id='lession-btn-${lession.level_no}' onclick="loadLevelWord(${lession.level_no})" class="btn btn-outline btn-primary lession-active"><i class="fa-solid fa-book-open"></i> Lesson ${lession.level_no}</button>
    `;
    lessonContainer.appendChild(btnDiv);
  }
};

lavelData();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const inputSearch = document.getElementById("input-search");
  const inputValue = inputSearch.value.trim().toLowerCase();
  console.log(inputValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWord = allWords.filter((word) =>
        word.word.toLowerCase().includes(inputValue),
      );
      displayLevelWord(filterWord);
    });
});
