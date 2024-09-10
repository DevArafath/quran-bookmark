document.addEventListener('DOMContentLoaded', function () {
    const surahDropdown = document.getElementById('surah-dropdown');
    const surahArabicLabel = document.getElementById('surah-arabic');
    const verseDropdown = document.getElementById('verse-dropdown');
    const savedBookmark = document.getElementById('saved-bookmark');
    const savedBookmarkArabic = document.getElementById('saved-bookmark-arabic');
    const saveButton = document.getElementById('save-bookmark');
    const juzLabel = document.getElementById('juz-number');

    // Fetch Surah and Juz data dynamically
    async function fetchSurahs() {
        const response = await fetch('quran-surah-data.json'); // Update with your JSON file path
        return await response.json();
    }

    async function fetchJuzData() {
        const response = await fetch('quran-juz-data.json'); // Update with your JSON file path
        return await response.json();
    }

    // Convert numbers to Arabic numerals
    function toArabicNumerals(num) {
        return num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    }

    // Populate the Surah dropdown
    function populateSurahDropdown(surahs) {
        surahs.forEach((surah, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = surah.english;
            surahDropdown.appendChild(option);
        });
    }

    // Populate the verse dropdown based on selected Surah
    function populateVerseDropdown(verses) {
        verseDropdown.innerHTML = '';
        for (let i = 1; i <= verses; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            verseDropdown.appendChild(option);
        }
    }

    // Calculate and display the Juz' number based on the selected verse
    function calculateJuz(selectedSurahIndex, selectedVerse, juzData) {
        let juzNumber = 1;
        for (let i = 0; i < juzData.length; i++) {
            const juz = juzData[i];
            if (selectedSurahIndex + 1 > juz.surah || (selectedSurahIndex + 1 === juz.surah && selectedVerse >= juz.verse)) {
                juzNumber = juz.juz;
            }
        }
        return juzNumber;
    }

    // Display the selected Surah in Arabic and calculate Juz'
    function displaySelectedSurah(surahs, juzData) {
        const selectedSurah = surahs[surahDropdown.value];
        const surahNumber = parseInt(surahDropdown.value) + 1;
        const arabicSurahNumber = toArabicNumerals(surahNumber);
        surahArabicLabel.textContent = `${arabicSurahNumber}. ${selectedSurah.arabic}`;
        populateVerseDropdown(selectedSurah.verses);
        displayJuzNumber(surahs, juzData); // Display Juz' number on Surah change
    }

    // Display the Juz' number based on the selected verse
    function displayJuzNumber(surahs, juzData) {
        const selectedSurahIndex = parseInt(surahDropdown.value);
        const selectedVerse = parseInt(verseDropdown.value);
        const juzNumber = calculateJuz(selectedSurahIndex, selectedVerse, juzData);
        juzLabel.textContent = `Juz': ${juzNumber}`;
    }

    // Load saved bookmark from localStorage
    function loadSavedBookmark() {
        const savedData = localStorage.getItem('bookmark');
        const savedDataArabic = localStorage.getItem('bookmarkArabic');
        const savedJuz = localStorage.getItem('juzNumber');
        if (savedData) {
            savedBookmark.textContent = savedData;
        }
        if (savedDataArabic) {
            savedBookmarkArabic.textContent = savedDataArabic;
        }
        if (savedJuz) {
            juzLabel.textContent = `Juz': ${savedJuz}`;
        }
    }

    // Save bookmark
    function saveBookmark(surahs, juzData) {
        const selectedIndex = surahDropdown.selectedIndex;
        const selectedSurah = surahs[selectedIndex];
        const surahNumber = selectedIndex + 1;
        const arabicSurahNumber = toArabicNumerals(surahNumber);
        const selectedVerse = verseDropdown.value;
        const arabicSelectedVerse = toArabicNumerals(selectedVerse);

        const bookmark = `${selectedSurah.english}, Verse: ${selectedVerse}`;
        const bookmarkArabic = `${arabicSurahNumber} . ${selectedSurah.arabic}، الآية: ${arabicSelectedVerse}`;
        const juzNumber = calculateJuz(selectedIndex, parseInt(selectedVerse), juzData);

        // Save to localStorage
        localStorage.setItem('bookmark', bookmark);
        localStorage.setItem('bookmarkArabic', bookmarkArabic);
        localStorage.setItem('juzNumber', juzNumber);

        // Display saved bookmark
        savedBookmark.textContent = bookmark;
        savedBookmarkArabic.textContent = bookmarkArabic;
        juzLabel.textContent = `Juz': ${juzNumber}`;
    }

    // Reset bookmark
    function resetBookmark() {
        // Clear localStorage
        localStorage.removeItem('bookmark');
        localStorage.removeItem('bookmarkArabic');
        localStorage.removeItem('juzNumber');

        // Clear displayed bookmark
        savedBookmark.textContent = '';
        savedBookmarkArabic.textContent = '';
        juzLabel.textContent = 'Juz\': N/A';
    }

    // Event listeners
    surahDropdown.addEventListener('change', function() {
        Promise.all([fetchSurahs(), fetchJuzData()]).then(([surahs, juzData]) => {
            displaySelectedSurah(surahs, juzData);
        });
    });

    verseDropdown.addEventListener('change', function() {
        Promise.all([fetchSurahs(), fetchJuzData()]).then(([surahs, juzData]) => {
            displayJuzNumber(surahs, juzData);
        });
    });

    saveButton.addEventListener('click', function () {
        Promise.all([fetchSurahs(), fetchJuzData()]).then(([surahs, juzData]) => {
            if (surahDropdown.value !== "" && verseDropdown.value !== "") {
                saveBookmark(surahs, juzData);
            } else {
                alert("Please select both a Surah and a Verse before saving.");
            }
        });
    });

    document.getElementById('reset-bookmark').addEventListener('click', resetBookmark);

    // Initial setup
    Promise.all([fetchSurahs(), fetchJuzData()]).then(([surahs, juzData]) => {
        populateSurahDropdown(surahs);
        loadSavedBookmark();
    });
});