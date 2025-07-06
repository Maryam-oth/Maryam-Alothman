// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Select the main course menu and the toggle icon for mobile
    const courseMenu = document.querySelector('.course-menu');
    const menuIcon = document.querySelector('.menu-icon');

    // Select all menu items that can expand (folders)
    const folderItems = document.querySelectorAll('.course-menu .menu-item.folder');

    // Add click event listener to the mobile menu icon
    if (menuIcon && courseMenu) {
        menuIcon.addEventListener('click', () => {
            courseMenu.classList.toggle('active'); // Toggle 'active' class to show/hide menu
        });
    }

    // Add click event listeners to folder items to toggle submenus
    folderItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent event from bubbling up if a submenu item was clicked
            if (event.target.tagName === 'LI' && event.target.classList.contains('folder')) {
                // Toggle the 'expanded' class on the clicked folder item
                item.classList.toggle('expanded');
            }
        });
    });

    // Handle active menu item highlighting (optional: if you want dynamic highlighting based on content)
    // For a static site, the 'active' class is usually set manually in HTML
    // but this example shows how you might set it via JS for demonstration.
    const allMenuItems = document.querySelectorAll('.course-menu li');

    allMenuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Remove 'active' from all items
            allMenuItems.forEach(li => li.classList.remove('active'));

            // Add 'active' to the clicked item
            // Ensure we're targeting the actual li element, not its children like icons or text spans
            let targetItem = event.target;
            while (targetItem && targetItem.tagName !== 'LI') {
                targetItem = targetItem.parentElement;
            }
            if (targetItem) {
                targetItem.classList.add('active');
            }

            // If on mobile, close the menu after selecting an item
            if (window.innerWidth <= 767 && courseMenu.classList.contains('active')) {
                // Delay closing slightly to allow visual feedback of click
                setTimeout(() => {
                    courseMenu.classList.remove('active');
                }, 200);
            }
        });
    });

    // Initialize the first folder as expanded by default (if it has the active class or you want it open)
    const initialActiveFolder = document.querySelector('.course-menu .menu-item.folder .submenu .menu-item.active');
    if (initialActiveFolder) {
        let parentFolder = initialActiveFolder.closest('.menu-item.folder');
        if (parentFolder) {
            parentFolder.classList.add('expanded');
        }
    }

    // Show video and hide welcome content on submenu click (multiple videos)
    const showVideoBtns = document.querySelectorAll('.show-video');
    const videoBoxes = [
        document.getElementById('video-box-1'),
        document.getElementById('video-box-2')
    ];
    const welcomeWrapper2 = document.querySelector('.welcome-wrapper');
    const closeVideoBtns = document.querySelectorAll('.close-video');

    // Utility to hide all content boxes
    function hideAllContentBoxes() {
        document.querySelectorAll('.video-box').forEach(box => {
            box.style.display = 'none';
            // Stop YouTube video playback by resetting src
            const iframe = box.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = src;
            }
        });
        // Hide all quiz boxes including quiz-box-2
        document.querySelectorAll('.quiz-box').forEach(box => {
            box.style.display = 'none';
        });
        // Hide all quiz popups
        document.querySelectorAll('.quiz-popup').forEach(popup => {
            popup.style.display = 'none';
        });
        if (locationBox) locationBox.style.display = 'none';
        if (welcomeWrapper2) welcomeWrapper2.style.display = 'none';
    }

    function showVideoBoxWithAutoplay(vid) {
        hideAllContentBoxes();
        let box = document.getElementById('video-box-' + vid);
        if (!box) return;
        let iframe = box.querySelector('iframe');
        let origSrc = iframe.getAttribute('data-orig-src');
        if (!origSrc) {
            origSrc = iframe.src;
            iframe.setAttribute('data-orig-src', origSrc);
        }
        // Remove the old iframe
        iframe.remove();
        // Add autoplay=1 and mute=1 to the src
        let newSrc = origSrc;
        if (newSrc.indexOf('autoplay=1') === -1) {
            newSrc += (newSrc.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
        }
        if (newSrc.indexOf('mute=1') === -1) {
            newSrc += (newSrc.indexOf('?') === -1 ? '?' : '&') + 'mute=1';
        }
        // Create a new iframe with autoplay and mute
        let newIframe = document.createElement('iframe');
        newIframe.width = "560";
        newIframe.height = "315";
        newIframe.src = newSrc;
        newIframe.title = iframe.title;
        newIframe.frameBorder = "0";
        newIframe.allowFullscreen = true;
        // Insert the new iframe back in the same place (after close button)
        let btn = box.querySelector('.close-video');
        btn.insertAdjacentElement('afterend', newIframe);
        box.style.display = 'block';
    }

    showVideoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            let vid = btn.getAttribute('data-video');
            showVideoBoxWithAutoplay(vid);
        });
    });
    closeVideoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.video-box').forEach(box => {
                let iframe = box.querySelector('iframe');
                if (iframe) {
                    let origSrc = iframe.getAttribute('data-orig-src');
                    if (origSrc) {
                        iframe.src = origSrc;
                    }
                }
            });
            hideAllContentBoxes();
            if (welcomeWrapper2) welcomeWrapper2.style.display = '';
        });
    });

    // Toggle submenu for SL Basics on click (folder-row only)
    const slBasicsFolder = document.querySelector('.sl-basics-folder');
    const folderRow = slBasicsFolder ? slBasicsFolder.querySelector('.folder-row') : null;
    if (slBasicsFolder && folderRow) {
        folderRow.addEventListener('click', function(e) {
            slBasicsFolder.classList.toggle('expanded');
        });
        document.addEventListener('click', function(e) {
            // Only close if click is outside the folder and its submenu
            if (!slBasicsFolder.contains(e.target)) {
                slBasicsFolder.classList.remove('expanded');
            }
        });
    }

    // Show quiz box and hide others on 'quiz 1' click
    const showQuizBtns = document.querySelectorAll('.show-quiz');
    const closeQuizBtns = document.querySelectorAll('.close-quiz');

    showQuizBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllContentBoxes();
            // Show the selected quiz box
            const quiz = btn.getAttribute('data-quiz');
            const box = document.getElementById('quiz-box-' + quiz);
            if (box) box.style.display = 'block';
        });
    });
    closeQuizBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            hideAllContentBoxes();
            if (welcomeWrapper2) welcomeWrapper2.style.display = '';
        });
    });

    // Quiz 1 radio form logic with popup
    const quiz1Form = document.getElementById('quiz1-form');
    const quiz1Popup = document.getElementById('quiz1-popup');
    const quiz1PopupMsg = document.getElementById('quiz1-popup-message');
    const closeQuizPopupBtn = document.querySelector('.close-quiz-popup');
    if (quiz1Form && quiz1Popup && quiz1PopupMsg && closeQuizPopupBtn) {
        quiz1Form.addEventListener('submit', function(e) {
            e.preventDefault();
            const selected = quiz1Form.querySelector('input[name="quiz1"]:checked');
            if (!selected) {
                quiz1PopupMsg.textContent = 'Please select an answer.';
                quiz1PopupMsg.className = '';
                quiz1Popup.style.display = 'flex';
                return;
            }
            if (selected.value === 'C') {
                quiz1PopupMsg.textContent = 'Correct!';
                quiz1PopupMsg.className = 'quiz-popup-message-correct';
            } else {
                quiz1PopupMsg.innerHTML = '<span class="quiz-popup-incorrect-icon">🚫</span>Incorrect! Option C is the correct one';
                quiz1PopupMsg.className = 'quiz-popup-message-incorrect';
            }
            quiz1Popup.style.display = 'flex';
        });
        closeQuizPopupBtn.addEventListener('click', function() {
            quiz1Popup.style.display = 'none';
        });
    }

    // Continue button navigation logic
    const continueBtns = document.querySelectorAll('.continue-btn');
    continueBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            hideAllContentBoxes();
            const next = btn.getAttribute('data-next');
            if (next === '2') {
                const box = document.getElementById('video-box-2');
                if (box) box.style.display = 'block';
            } else if (next === 'adv2') {
                const box = document.getElementById('video-box-adv2');
                if (box) box.style.display = 'block';
            } else if (next === 'adv1') {
                hideAllContentBoxes();
                // Expand SL Advanced, collapse SL Basics
                const slAdvancedFolder = document.querySelector('.sl-advanced-folder');
                const slBasicsFolder = document.querySelector('.sl-basics-folder');
                if (slAdvancedFolder) slAdvancedFolder.classList.add('expanded');
                if (slBasicsFolder) slBasicsFolder.classList.remove('expanded');
                const box = document.getElementById('video-box-adv1');
                if (box) box.style.display = 'block';
            } else if (next === 'quiz') {
                const box = document.getElementById('quiz-box-1');
                if (box) box.style.display = 'block';
            } else if (next === 'welcome') {
                if (welcomeWrapper2) welcomeWrapper2.style.display = '';
            } else if (next === 'location') {
                hideAllContentBoxes();
                if (locationBox) {
                    locationBox.style.display = 'block';
                    setTimeout(initLeafletMap, 100);
                }
            } else if (next === 'certificate') {
                const certBox = document.getElementById('certificate-box');
                if (certBox) certBox.style.display = 'block';
            }
        });
    });

    // Location box logic
    const locationMenuItem = document.querySelector('.course-menu-location');
    const locationBox = document.getElementById('location-box');
    const closeLocationBtn = document.querySelector('.close-location');

    // Leaflet map logic
    let leafletMapInitialized = false;
    let leafletMap, markerDammam, markerJeddah, markerRiyadh;
    function initLeafletMap() {
        if (leafletMapInitialized) return;
        leafletMapInitialized = true;
        leafletMap = L.map('leaflet-map').setView([24.774265, 46.738586], 5.5); // Center on Saudi Arabia
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(leafletMap);
        // Create markers but don't add them to map initially
        markerDammam = L.marker([26.4207, 50.0888]).bindPopup('Dammam - Web Academy for Kids');
        markerJeddah = L.marker([21.4858, 39.1925]).bindPopup('Jeddah - Web Academy for Expert');
        markerRiyadh = L.marker([24.7136, 46.6753]).bindPopup('Riyadh - Web Academy for Expert');
    }
    if (locationMenuItem && locationBox && closeLocationBtn) {
        locationMenuItem.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllContentBoxes();
            locationBox.style.display = 'block';
            setTimeout(initLeafletMap, 100);
        });
        closeLocationBtn.addEventListener('click', function() {
            hideAllContentBoxes();
            if (welcomeWrapper2) welcomeWrapper2.style.display = '';
        });
        // Filter button logic
        const kidsBtn = locationBox.querySelector('.kids-btn');
        const expertBtn = locationBox.querySelector('.expert-btn');
        const allBtn = locationBox.querySelector('.all-btn');
        const clearBtn = locationBox.querySelector('.clear-btn');
        if (kidsBtn && expertBtn && allBtn && clearBtn) {
            kidsBtn.addEventListener('click', function() {
                if (leafletMap && markerDammam && markerJeddah && markerRiyadh) {
                    markerDammam.addTo(leafletMap);
                    markerJeddah.removeFrom(leafletMap);
                    markerRiyadh.removeFrom(leafletMap);
                }
            });
            expertBtn.addEventListener('click', function() {
                if (leafletMap && markerDammam && markerJeddah && markerRiyadh) {
                    markerDammam.removeFrom(leafletMap);
                    markerJeddah.addTo(leafletMap);
                    markerRiyadh.addTo(leafletMap);
                }
            });
            allBtn.addEventListener('click', function() {
                if (leafletMap && markerDammam && markerJeddah && markerRiyadh) {
                    markerDammam.addTo(leafletMap);
                    markerJeddah.addTo(leafletMap);
                    markerRiyadh.addTo(leafletMap);
                }
            });
            clearBtn.addEventListener('click', function() {
                if (leafletMap && markerDammam && markerJeddah && markerRiyadh) {
                    markerDammam.removeFrom(leafletMap);
                    markerJeddah.removeFrom(leafletMap);
                    markerRiyadh.removeFrom(leafletMap);
                }
            });
        }
    }

    // Toggle submenu for SL Advanced on click (folder-row only)
    const slAdvancedFolder = document.querySelector('.sl-advanced-folder');
    const advancedFolderRow = slAdvancedFolder ? slAdvancedFolder.querySelector('.folder-row') : null;
    if (slAdvancedFolder && advancedFolderRow) {
        advancedFolderRow.addEventListener('click', function(e) {
            slAdvancedFolder.classList.toggle('expanded');
        });
        document.addEventListener('click', function(e) {
            // Only close if click is outside the folder and its submenu
            if (!slAdvancedFolder.contains(e.target)) {
                slAdvancedFolder.classList.remove('expanded');
            }
        });
    }

    // Quiz 2 radio form logic with popup
    const quiz2Form = document.getElementById('quiz2-form');
    const quiz2Popup = document.getElementById('quiz2-popup');
    const quiz2PopupMsg = document.getElementById('quiz2-popup-message');
    const closeQuiz2PopupBtn = quiz2Popup ? quiz2Popup.querySelector('.close-quiz-popup') : null;
    if (quiz2Form && quiz2Popup && quiz2PopupMsg && closeQuiz2PopupBtn) {
        quiz2Form.addEventListener('submit', function(e) {
            e.preventDefault();
            const selected = quiz2Form.querySelector('input[name="quiz2"]:checked');
            if (!selected) {
                quiz2PopupMsg.textContent = 'Please select an answer.';
                quiz2PopupMsg.className = '';
                quiz2Popup.style.display = 'flex';
                return;
            }
            if (selected.value === 'B') {
                quiz2PopupMsg.textContent = 'Correct!';
                quiz2PopupMsg.className = 'quiz-popup-message-correct';
            } else {
                quiz2PopupMsg.innerHTML = '<span class="quiz-popup-incorrect-icon">🚫</span>Incorrect! Option B is the correct one';
                quiz2PopupMsg.className = 'quiz-popup-message-incorrect';
            }
            quiz2Popup.style.display = 'flex';
        });
        closeQuiz2PopupBtn.addEventListener('click', function() {
            quiz2Popup.style.display = 'none';
        });
    }

    // Sidebar expand/collapse logic
    const sidebar = document.querySelector('.sidebar');
    const lockBtn = document.getElementById('sidebar-lock-btn');
    const lockIcon = document.getElementById('sidebar-lock-icon');
    
    if (sidebar && lockBtn && lockIcon) {
        // Initialize state (default to expanded)
        let isExpanded = true;
        
        lockBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            sidebar.classList.toggle('sidebar-collapsed', !isExpanded);
            lockIcon.textContent = isExpanded ? '▼' : '▶';
            
            // Toggle visibility of all submenus
            const allSubmenus = document.querySelectorAll('.submenu');
            allSubmenus.forEach(submenu => {
                if (isExpanded) {
                    submenu.style.display = 'block';
                } else {
                    submenu.style.display = 'none';
                }
            });
            
            // Remove expanded class from folders when collapsed
            if (!isExpanded) {
                document.querySelectorAll('.sl-basics-folder, .sl-advanced-folder').forEach(folder => {
                    folder.classList.remove('expanded');
                });
            }
        });
    }

    // Add event listener for the new Continue button on the location page
    const locationContinueBtn = document.getElementById('location-continue-btn');
    if (locationContinueBtn) {
        locationContinueBtn.addEventListener('click', function() {
            hideAllContentBoxes();
            const certBox = document.getElementById('certificate-box');
            if (certBox) certBox.style.display = 'block';
        });
    }

    // Close certificate box logic
    const closeCertBtn = document.querySelector('.close-certificate');
    if (closeCertBtn) {
        closeCertBtn.addEventListener('click', function() {
            const certBox = document.getElementById('certificate-box');
            if (certBox) certBox.style.display = 'none';
            if (welcomeWrapper2) welcomeWrapper2.style.display = '';
        });
    }
});
