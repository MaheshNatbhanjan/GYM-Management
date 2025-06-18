
// FitLife Gym - Complete JavaScript Implementation
// Author: Mahesh Natbhanjan
// Email: maheshnatbhanjan@gmail.com

// Global Variables
let currentUser = null
let isAuthenticated = false
let darkMode = localStorage.getItem("darkMode") === "true"
let currentModal = null
let chatbotOpen = false
let progressChart = null

// Firebase Configuration (Demo - replace with your actual config)
const firebaseConfig = {
  // Your Firebase config here
  apiKey: "demo-api-key",
  authDomain: "fitlife-gym-demo.firebaseapp.com",
  projectId: "fitlife-gym-demo",
  storageBucket: "fitlife-gym-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
}

// Initialize Firebase (Demo)
// firebase.initializeApp(firebaseConfig);

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize Application
function initializeApp() {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    if (loadingScreen) {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }
  }, 2000)

  // Initialize components
  initializeNavigation()
  initializeScrollEffects()
  initializeDarkMode()
  initializeModals()
  initializeChatbot()
  initializeCounters()
  initializeSchedule()
  // initializeTour variable was undeclared.
  // initializeTour();
  initializeAuth()
  initializeProgressChart()

  // Check authentication status
  checkAuthStatus()

  // Initialize demo data
  initializeDemoData()
}

// Navigation Functions
function initializeNavigation() {
  const navbar = document.getElementById("navbar")
  const mobileMenu = document.getElementById("mobile-menu")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Mobile menu toggle
  if (mobileMenu) {
    mobileMenu.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")
      if (href.startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }

        // Close mobile menu
        if (navMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active")
          navMenu.classList.remove("active")
        }

        // Update active link
        navLinks.forEach((l) => l.classList.remove("active"))
        link.classList.add("active")
      }
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Update active navigation based on scroll position
    updateActiveNavigation()
  })
}

function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id], header[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Hero Section Animations
function initializeHeroAnimations() {
  // Animated counters
  const counters = document.querySelectorAll(".stat-number")
  const observerOptions = {
    threshold: 0.7,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    observer.observe(counter)
  })

  // Join now button functionality
  const joinNowBtn = document.getElementById("join-now-btn")
  if (joinNowBtn) {
    joinNowBtn.addEventListener("click", () => {
      if (isAuthenticated) {
        document.getElementById("membership").scrollIntoView({
          behavior: "smooth",
        })
      } else {
        openModal("auth-modal")
      }
    })
  }
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const increment = target / 100
  let current = 0

  const updateCounter = () => {
    if (current < target) {
      current += increment
      element.textContent = Math.ceil(current)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

// Virtual Tour Functions
function initializeVirtualTour() {
  const tourBtns = document.querySelectorAll(".tour-btn")
  const tourImages = document.querySelectorAll(".tour-image")

  tourBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const area = btn.getAttribute("data-area")

      // Update active button
      tourBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Update active image
      tourImages.forEach((img) => img.classList.remove("active"))
      const targetImage = document.querySelector(`[data-area="${area}"]`)
      if (targetImage) {
        targetImage.classList.add("active")
      }
    })
  })

  // Hotspot interactions
  const hotspots = document.querySelectorAll(".hotspot")
  hotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      const info = hotspot.getAttribute("data-info")
      showToast(info, "info")
    })
  })
}

// Schedule Functions
function initializeSchedule() {
  generateScheduleData()
  initializeScheduleFilters()
  initializeScheduleViews()
}

function generateScheduleData() {
  const scheduleData = [
    {
      time: "06:00",
      class: "Morning Yoga",
      trainer: "Sarah Chen",
      duration: "60 min",
      difficulty: "beginner",
      spots: 8,
      day: "monday",
    },
    {
      time: "07:00",
      class: "HIIT Training",
      trainer: "Marcus Williams",
      duration: "45 min",
      difficulty: "advanced",
      spots: 2,
      day: "monday",
    },
    {
      time: "09:00",
      class: "Pilates",
      trainer: "Sarah Chen",
      duration: "50 min",
      difficulty: "intermediate",
      spots: 5,
      day: "monday",
    },
    {
      time: "18:00",
      class: "Strength Training",
      trainer: "Alex Johnson",
      duration: "60 min",
      difficulty: "intermediate",
      spots: 0,
      day: "monday",
    },
    {
      time: "19:00",
      class: "Zumba",
      trainer: "Maria Garcia",
      duration: "45 min",
      difficulty: "beginner",
      spots: 12,
      day: "monday",
    },

    {
      time: "06:30",
      class: "CrossFit",
      trainer: "Marcus Williams",
      duration: "60 min",
      difficulty: "advanced",
      spots: 3,
      day: "tuesday",
    },
    {
      time: "08:00",
      class: "Yoga Flow",
      trainer: "Sarah Chen",
      duration: "75 min",
      difficulty: "intermediate",
      spots: 6,
      day: "tuesday",
    },
    {
      time: "17:30",
      class: "Boxing",
      trainer: "Mike Torres",
      duration: "50 min",
      difficulty: "intermediate",
      spots: 4,
      day: "tuesday",
    },
    {
      time: "19:00",
      class: "Spin Class",
      trainer: "Lisa Park",
      duration: "45 min",
      difficulty: "beginner",
      spots: 8,
      day: "tuesday",
    },

    {
      time: "06:00",
      class: "Morning Stretch",
      trainer: "Sarah Chen",
      duration: "30 min",
      difficulty: "beginner",
      spots: 10,
      day: "wednesday",
    },
    {
      time: "07:00",
      class: "Functional Training",
      trainer: "Alex Johnson",
      duration: "55 min",
      difficulty: "intermediate",
      spots: 5,
      day: "wednesday",
    },
    {
      time: "18:00",
      class: "Hot Yoga",
      trainer: "Emma Wilson",
      duration: "90 min",
      difficulty: "intermediate",
      spots: 3,
      day: "wednesday",
    },
    {
      time: "19:30",
      class: "Aqua Fitness",
      trainer: "David Kim",
      duration: "45 min",
      difficulty: "beginner",
      spots: 15,
      day: "wednesday",
    },
  ]

  populateScheduleTable(scheduleData)
}

function populateScheduleTable(data) {
  const tbody = document.getElementById("schedule-body")
  if (!tbody) return

  tbody.innerHTML = ""

  data.forEach((item) => {
    const row = document.createElement("tr")
    row.setAttribute("data-day", item.day)

    const spotsClass = item.spots === 0 ? "spots-full" : item.spots <= 3 ? "spots-limited" : "spots-available"
    const spotsText = item.spots === 0 ? "Full" : `${item.spots} left`

    row.innerHTML = `
            <td>${item.time}</td>
            <td><strong>${item.class}</strong></td>
            <td>${item.trainer}</td>
            <td>${item.duration}</td>
            <td><span class="difficulty-badge difficulty-${item.difficulty}">${item.difficulty}</span></td>
            <td><span class="${spotsClass}">${spotsText}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" ${item.spots === 0 ? "disabled" : ""} onclick="bookClass('${item.class}', '${item.trainer}', '${item.time}')">
                    ${item.spots === 0 ? "Full" : "Book"}
                </button>
            </td>
        `

    tbody.appendChild(row)
  })
}

function initializeScheduleFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const day = btn.getAttribute("data-day")

      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      filterScheduleByDay(day)
    })
  })
}

function filterScheduleByDay(day) {
  const rows = document.querySelectorAll("#schedule-body tr")

  rows.forEach((row) => {
    if (day === "all" || row.getAttribute("data-day") === day) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

function initializeScheduleViews() {
  const viewBtns = document.querySelectorAll(".view-btn")
  const tableView = document.querySelector(".schedule-table-view")
  const calendarView = document.querySelector(".schedule-calendar-view")

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view")

      viewBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      if (view === "table") {
        tableView.classList.add("active")
        calendarView.classList.remove("active")
      } else {
        tableView.classList.remove("active")
        calendarView.classList.add("active")
      }
    })
  })
}

function bookClass(className, trainer, time) {
  if (!isAuthenticated) {
    showToast("Please login to book classes", "error")
    openModal("auth-modal")
    return
  }

  // Open payment modal with class details
  openPaymentModal({
    service: className,
    trainer: trainer,
    date: "Today",
    time: time,
    amount: "$25.00",
  })
}

// Health Tools Functions
function initializeHealthTools() {
  setupBMICalculator()
  setupHeartRateCalculator()
  setupCalorieCalculator()
}

function setupBMICalculator() {
  const calculateBtn = document.getElementById("calculate-bmi")
  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateBMI)
  }
}

function calculateBMI() {
  const height = Number.parseFloat(document.getElementById("height").value)
  const weight = Number.parseFloat(document.getElementById("weight").value)

  if (!height || !weight) {
    showToast("Please enter both height and weight", "warning")
    return
  }

  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  const bmiValue = document.getElementById("bmi-value")
  const bmiCategory = document.getElementById("bmi-category")

  bmiValue.textContent = bmi.toFixed(1)

  let category = ""
  if (bmi < 18.5) {
    category = "Underweight"
    bmiCategory.style.color = "#3498db"
  } else if (bmi < 25) {
    category = "Normal weight"
    bmiCategory.style.color = "#27ae60"
  } else if (bmi < 30) {
    category = "Overweight"
    bmiCategory.style.color = "#f39c12"
  } else {
    category = "Obese"
    bmiCategory.style.color = "#e74c3c"
  }

  bmiCategory.textContent = category

  showToast(`Your BMI is ${bmi.toFixed(1)} (${category})`, "success")
}

function setupHeartRateCalculator() {
  const calculateBtn = document.getElementById("calculate-hr")
  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateHeartRateZones)
  }
}

function calculateHeartRateZones() {
  const age = Number.parseInt(document.getElementById("age").value)

  if (!age || age < 15 || age > 100) {
    showToast("Please enter a valid age (15-100)", "warning")
    return
  }

  const maxHR = 220 - age
  const zones = [
    {
      name: "Zone 1 (50-60%)",
      min: Math.round(maxHR * 0.5),
      max: Math.round(maxHR * 0.6),
      type: "Recovery",
      class: "zone-1",
    },
    {
      name: "Zone 2 (60-70%)",
      min: Math.round(maxHR * 0.6),
      max: Math.round(maxHR * 0.7),
      type: "Endurance",
      class: "zone-2",
    },
    {
      name: "Zone 3 (70-80%)",
      min: Math.round(maxHR * 0.7),
      max: Math.round(maxHR * 0.8),
      type: "Aerobic",
      class: "zone-3",
    },
    {
      name: "Zone 4 (80-90%)",
      min: Math.round(maxHR * 0.8),
      max: Math.round(maxHR * 0.9),
      type: "Anaerobic",
      class: "zone-4",
    },
    { name: "Zone 5 (90-100%)", min: Math.round(maxHR * 0.9), max: maxHR, type: "Neuromuscular", class: "zone-5" },
  ]

  const hrZonesContainer = document.getElementById("hr-zones")
  hrZonesContainer.innerHTML = zones
    .map(
      (zone) => `
        <div class="hr-zone ${zone.class}">
            <span>${zone.name}</span>
            <span>${zone.min}-${zone.max} bpm (${zone.type})</span>
        </div>
    `,
    )
    .join("")

  showToast(`Heart rate zones calculated for age ${age}`, "success")
}

function setupCalorieCalculator() {
  const calculateBtn = document.getElementById("calculate-calories")
  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateCalories)
  }
}

function calculateCalories() {
  const weight = Number.parseFloat(document.getElementById("cal-weight").value)
  const duration = Number.parseInt(document.getElementById("workout-duration").value)
  const workoutType = document.getElementById("workout-type").value

  if (!weight || !duration || !workoutType) {
    showToast("Please fill in all fields", "warning")
    return
  }

  // MET values for different activities
  const metValues = {
    cardio: 8,
    strength: 6,
    yoga: 3,
    hiit: 10,
  }

  const met = metValues[workoutType] || 6
  const calories = Math.round((met * weight * duration) / 60)

  const caloriesBurned = document.getElementById("calories-burned")
  caloriesBurned.textContent = calories

  showToast(`You burned approximately ${calories} calories!`, "success")
}

// Modal Functions
function initializeModals() {
  const modals = document.querySelectorAll(".modal")
  const closeButtons = document.querySelectorAll(".close-modal")

  // Close modal function
  function closeModal(modal) {
    modal.classList.remove("show")
    modal.style.display = "none"
    currentModal = null
    document.body.style.overflow = "auto"
  }

  // Open modal function
  function openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      currentModal = modal
      modal.style.display = "flex"
      setTimeout(() => modal.classList.add("show"), 10)
      document.body.style.overflow = "hidden"
    }
  }

  // Close button event listeners
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal")
      closeModal(modal)
    })
  })

  // Click outside to close
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal)
      }
    })
  })

  // Escape key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentModal) {
      closeModal(currentModal)
    }
  })

  // Modal tab functionality
  initializeModalTabs()

  // Expose openModal globally
  window.openModal = openModal
  window.closeModal = closeModal
}

function initializeModalTabs() {
  // Auth tabs
  const authTabs = document.querySelectorAll(".auth-tab")
  const authForms = document.querySelectorAll(".auth-form")

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab")

      authTabs.forEach((t) => t.classList.remove("active"))
      authForms.forEach((f) => f.classList.remove("active"))

      tab.classList.add("active")
      document.getElementById(`${targetTab}-form-container`).classList.add("active")
    })
  })

  // Feature modal tabs
  initializeFeatureModalTabs()
}

function initializeFeatureModalTabs() {
  const tabSystems = ["checkin", "progress", "workout", "nutrition", "community", "achievement"]

  tabSystems.forEach((system) => {
    const tabs = document.querySelectorAll(`.${system}-tab-btn`)
    const panes = document.querySelectorAll(`.${system}-tab-pane`)

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetTab = tab.getAttribute("data-tab")

        tabs.forEach((t) => t.classList.remove("active"))
        panes.forEach((p) => p.classList.remove("active"))

        tab.classList.add("active")
        const targetPane = document.getElementById(
          `${targetTab}-${system === "achievement" ? "achievements" : system === "checkin" ? "qr" : system === "progress" ? "progress" : "tab"}`,
        )
        if (targetPane) {
          targetPane.classList.add("active")
        }
      })
    })
  })
}

function setupAuthModal() {
  const loginBtn = document.getElementById("login-btn")
  const authTabs = document.querySelectorAll(".auth-tab")
  const authForms = document.querySelectorAll(".auth-form")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")

  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault()
      openModal("auth-modal")
    })
  }

  // Auth tab switching
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabType = tab.getAttribute("data-tab")

      // Update active tab
      authTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Show corresponding form
      authForms.forEach((form) => form.classList.remove("active"))
      const targetForm = document.getElementById(`${tabType}-form-container`)
      if (targetForm) {
        targetForm.classList.add("active")
      }
    })
  })

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      handleLogin()
    })
  }

  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      handleSignup()
    })
  }
}

function handleLogin() {
  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  if (!email || !password) {
    showToast("Please fill in all fields", "warning")
    return
  }

  // Demo login - accept any credentials
  if (email === "demo@fitlife.com" && password === "password") {
    currentUser = {
      id: 1,
      name: "Demo User",
      email: email,
      membership: "Premium",
      joinDate: "2024-01-15",
      profileImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    }

    isAuthenticated = true
    updateAuthUI()
    closeModal("auth-modal")
    showToast("Welcome back, Demo User!", "success")
  } else {
    showToast("Invalid credentials. Use demo@fitlife.com / password", "error")
  }
}

function handleSignup() {
  const firstName = document.getElementById("signup-first-name").value
  const lastName = document.getElementById("signup-last-name").value
  const email = document.getElementById("signup-email").value
  const password = document.getElementById("signup-password").value
  const confirmPassword = document.getElementById("signup-confirm-password").value
  const agreeTerms = document.getElementById("agree-terms").checked

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showToast("Please fill in all fields", "warning")
    return
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error")
    return
  }

  if (!agreeTerms) {
    showToast("Please agree to the terms and conditions", "warning")
    return
  }

  // Create new user
  currentUser = {
    id: Date.now(),
    name: `${firstName} ${lastName}`,
    email: email,
    membership: "Basic",
    joinDate: new Date().toISOString().split("T")[0],
    profileImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  }

  isAuthenticated = true
  updateAuthUI()
  closeModal("auth-modal")
  showToast(`Welcome to FitLife, ${firstName}!`, "success")
}

function updateAuthUI() {
  const loginBtn = document.getElementById("login-btn")
  const userProfile = document.getElementById("user-profile")
  const userName = document.getElementById("user-name")
  const profileImg = document.getElementById("profile-img")

  if (isAuthenticated && currentUser) {
    loginBtn.classList.add("hidden")
    userProfile.classList.remove("hidden")
    userName.textContent = currentUser.name
    profileImg.src = currentUser.profileImage
  } else {
    loginBtn.classList.remove("hidden")
    userProfile.classList.add("hidden")
  }
}

function logout() {
  currentUser = null
  isAuthenticated = false
  updateAuthUI()
  showToast("Logged out successfully", "success")
}

// Authentication System
// function initializeAuth() {  // Removed duplicated function
//     const loginBtn = document.getElementById('login-btn');
//     const logoutBtn = document.getElementById('logout-btn');
//     const loginForm = document.getElementById('login-form');
//     const signupForm = document.getElementById('signup-form');
//     const googleSigninBtn = document.getElementById('google-signin-btn');
//     const joinNowBtn = document.getElementById('join-now-btn');

//     // Login button click
//     if (loginBtn) {
//         loginBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             openModal('auth-modal');
//         });
//     }

//     // Join now button click
//     if (joinNowBtn) {
//         joinNowBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             openModal('auth-modal');
//             // Switch to signup tab
//             document.querySelector('.auth-tab[data-tab="signup"]').click();
//         });
//     }

//     // Login form submission
//     if (loginForm) {
//         loginForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const email = document.getElementById('login-email').value;
//             const password = document.getElementById('login-password').value;

//             // Demo login
//             if (email && password) {
//                 loginUser({
//                     email: email,
//                     name: email.split('@')[0],
//                     avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
//                 });
//                 closeModal(document.getElementById('auth-modal'));
//                 showToast('Login successful!', 'success');
//             }
//         });
//     }

//     // Signup form submission
//     if (signupForm) {
//         signupForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const firstName = document.getElementById('signup-first-name').value;
//             const lastName = document.getElementById('signup-last-name').value;
//             const email = document.getElementById('signup-email').value;
//             const password = document.getElementById('signup-password').value;
//             const confirmPassword = document.getElementById('signup-confirm-password').value;

//             if (password !== confirmPassword) {
//                 showToast('Passwords do not match!', 'error');
//                 return;
//             }

//             // Demo signup
//             if (firstName && lastName && email && password) {
//                 loginUser({
//                     email: email,
//                     name: `${firstName} ${lastName}`,
//                     avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
//                 });
//                 closeModal(document.getElementById('auth-modal'));
//                 showToast('Account created successfully!', 'success');
//             }
//         });
//     }

//     // Google Sign-in
//     if (googleSigninBtn) {
//         googleSigninBtn.addEventListener('click', () => {
//             // Demo Google login
//             loginUser({
//                 email: 'user@gmail.com',
//                 name: 'Google User',
//                 avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
//             });
//             closeModal(document.getElementById('auth-modal'));
//             showToast('Google login successful!', 'success');
//         });
//     }

//     // Logout
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             logoutUser();
//         });
//     }
// }

function loginUser(userData) {
  currentUser = userData
  isAuthenticated = true

  // Update UI
  const loginBtn = document.getElementById("login-btn")
  const userProfile = document.getElementById("user-profile")
  const userName = document.getElementById("user-name")
  const profileImg = document.getElementById("profile-img")

  if (loginBtn) loginBtn.style.display = "none"
  if (userProfile) userProfile.classList.remove("hidden")
  if (userName) userName.textContent = userData.name
  if (profileImg) profileImg.src = userData.avatar

  // Update QR code info
  updateQRCodeInfo()
}

function logoutUser() {
  currentUser = null
  isAuthenticated = false

  // Update UI
  const loginBtn = document.getElementById("login-btn")
  const userProfile = document.getElementById("user-profile")

  if (loginBtn) loginBtn.style.display = "inline-flex"
  if (userProfile) userProfile.classList.add("hidden")

  showToast("Logged out successfully!", "success")
}

function checkAuthStatus() {
  // Check if user is logged in (demo)
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    loginUser(JSON.parse(savedUser))
  }
}

// Setup logout functionality
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }
})

function setupPricingToggle() {
  const pricingToggle = document.getElementById("pricing-toggle")
  const monthlyAmounts = document.querySelectorAll(".amount.monthly")
  const annualAmounts = document.querySelectorAll(".amount.annual")
  const monthlyPeriods = document.querySelectorAll(".period.monthly")
  const annualPeriods = document.querySelectorAll(".period.annual")
  const toggleLabels = document.querySelectorAll(".toggle-label")

  if (pricingToggle) {
    pricingToggle.addEventListener("change", () => {
      const isAnnual = pricingToggle.checked

      // Toggle amounts and periods
      monthlyAmounts.forEach((amount) => {
        amount.classList.toggle("hidden", isAnnual)
      })
      annualAmounts.forEach((amount) => {
        amount.classList.toggle("hidden", !isAnnual)
      })
      monthlyPeriods.forEach((period) => {
        period.classList.toggle("hidden", isAnnual)
      })
      annualPeriods.forEach((period) => {
        period.classList.toggle("hidden", !isAnnual)
      })

      // Update toggle labels
      toggleLabels.forEach((label) => {
        label.classList.remove("active")
      })

      if (isAnnual) {
        toggleLabels[1].classList.add("active")
      } else {
        toggleLabels[0].classList.add("active")
      }
    })
  }
}

function setupMembershipSelection() {
  const selectPlanBtns = document.querySelectorAll(".select-plan")

  selectPlanBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.getAttribute("data-plan")
      selectMembershipPlan(plan)
    })
  })
}

function selectMembershipPlan(plan) {
  if (!isAuthenticated) {
    showToast("Please login to select a membership plan", "warning")
    openModal("auth-modal")
    return
  }

  showToast(`${plan} plan selected! Redirecting to payment...`, "success")

  // Simulate payment process
  setTimeout(() => {
    showToast("Payment successful! Welcome to FitLife!", "success")
    if (currentUser) {
      currentUser.membership = plan
    }
  }, 2000)
}

function setupTrainerBooking() {
  const bookTrainerBtns = document.querySelectorAll(".book-trainer")
  const viewScheduleBtns = document.querySelectorAll(".view-schedule")

  bookTrainerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const trainer = btn.getAttribute("data-trainer")
      bookTrainerSession(trainer)
    })
  })

  viewScheduleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const trainer = btn.getAttribute("data-trainer")
      viewTrainerSchedule(trainer)
    })
  })
}

function bookTrainerSession(trainer) {
  if (!isAuthenticated) {
    showToast("Please login to book a trainer session", "warning")
    openModal("auth-modal")
    return
  }

  showToast(`Booking session with ${trainer}...`, "info")

  // Simulate booking process
  setTimeout(() => {
    showToast(`Session booked with ${trainer}!`, "success")
  }, 1500)
}

function viewTrainerSchedule(trainer) {
  showToast(`Viewing ${trainer}'s schedule...`, "info")
  document.getElementById("schedule").scrollIntoView({ behavior: "smooth" })
}

// Advanced Features Functions
function generateQRCode() {
  if (!isAuthenticated) {
    showToast("Please login to generate QR code", "error")
    return
  }

  const qrContainer = document.getElementById("qr-code-container")
  const downloadBtn = document.getElementById("download-qr-btn")
  const shareBtn = document.getElementById("share-qr-btn")

  // Generate QR code data
  const qrData = {
    userId: currentUser.email,
    timestamp: Date.now(),
    membershipType: "Premium",
  }

  // Use QRCode library to generate QR code
  qrContainer.innerHTML = ""
  QRCode.toCanvas(
    qrContainer,
    JSON.stringify(qrData),
    {
      width: 200,
      height: 200,
      colorDark: "#ff6b35",
      colorLight: "#ffffff",
    },
    (error) => {
      if (error) {
        console.error(error)
        showToast("Error generating QR code", "error")
      } else {
        downloadBtn.disabled = false
        shareBtn.disabled = false
        showToast("QR code generated successfully!", "success")
      }
    },
  )
}

function updateQRCodeInfo() {
  if (isAuthenticated && currentUser) {
    document.getElementById("qr-user-name").textContent = currentUser.name
    document.getElementById("qr-member-id").textContent = `Member ID: ${currentUser.email.split("@")[0].toUpperCase()}`
    document.getElementById("qr-membership-type").textContent = "Membership: Premium"
  }
}

function downloadQRCode() {
  const canvas = document.querySelector("#qr-code-container canvas")
  if (canvas) {
    const link = document.createElement("a")
    link.download = "fitlife-qr-code.png"
    link.href = canvas.toDataURL()
    link.click()
  }
}

function shareQRCode() {
  if (navigator.share) {
    const canvas = document.querySelector("#qr-code-container canvas")
    if (canvas) {
      canvas.toBlob((blob) => {
        const file = new File([blob], "fitlife-qr-code.png", { type: "image/png" })
        navigator.share({
          title: "FitLife Gym QR Code",
          text: "My FitLife Gym check-in QR code",
          files: [file],
        })
      })
    }
  } else {
    showToast("Sharing not supported on this device", "info")
  }
}

function startQRScanner() {
  showToast("QR Scanner would start here (camera access required)", "info")
}

// Progress Tracking Functions
function openProgressTrackingModal() {
  openModal("progress-tracking-modal")
  initializeProgressChart()
}

function initializeProgressChart() {
  const ctx = document.getElementById("progress-chart")
  if (!ctx) return

  if (progressChart) {
    progressChart.destroy()
  }

  progressChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      datasets: [
        {
          label: "Weight (kg)",
          data: [78, 77.5, 77, 76.2, 75.8, 75.2],
          borderColor: "#ff6b35",
          backgroundColor: "rgba(255, 107, 53, 0.1)",
          tension: 0.4,
        },
        {
          label: "Body Fat %",
          data: [22, 21.5, 21, 20.5, 20, 19.5],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  })
}

function logWeight() {
  const weight = document.getElementById("weight-input").value
  const date = document.getElementById("weight-date").value

  if (weight && date) {
    // Add to weight entries (demo)
    const entriesContainer = document.getElementById("weight-entries")
    const newEntry = document.createElement("div")
    newEntry.className = "weight-entry"
    newEntry.innerHTML = `
            <span class="date">${new Date(date).toLocaleDateString()}</span>
            <span class="weight">${weight} kg</span>
            <span class="change">New entry</span>
        `
    entriesContainer.insertBefore(newEntry, entriesContainer.firstChild)

    // Clear inputs
    document.getElementById("weight-input").value = ""
    document.getElementById("weight-date").value = ""

    showToast("Weight logged successfully!", "success")
  } else {
    showToast("Please enter weight and date", "error")
  }
}

function logMeasurements() {
  const measurements = {
    chest: document.getElementById("chest-measurement").value,
    waist: document.getElementById("waist-measurement").value,
    hips: document.getElementById("hips-measurement").value,
    arms: document.getElementById("arms-measurement").value,
    thighs: document.getElementById("thighs-measurement").value,
    bodyfat: document.getElementById("bodyfat-measurement").value,
  }

  const hasData = Object.values(measurements).some((value) => value !== "")

  if (hasData) {
    showToast("Measurements logged successfully!", "success")
    // Clear inputs
    Object.keys(measurements).forEach((key) => {
      const input = document.getElementById(`${key}-measurement`)
      if (input) input.value = ""
    })
  } else {
    showToast("Please enter at least one measurement", "error")
  }
}

function addGoal() {
  const goalType = document.getElementById("goal-type").value
  const description = document.getElementById("goal-description").value
  const target = document.getElementById("goal-target").value
  const deadline = document.getElementById("goal-deadline").value

  if (goalType && description && target && deadline) {
    showToast("Goal added successfully!", "success")
    // Clear inputs
    document.getElementById("goal-type").value = ""
    document.getElementById("goal-description").value = ""
    document.getElementById("goal-target").value = ""
    document.getElementById("goal-deadline").value = ""
  } else {
    showToast("Please fill in all goal details", "error")
  }
}

// AI Workout Functions
function openAIWorkoutModal() {
  openModal("ai-workout-modal")
}

function generateAIWorkoutPlan() {
  const goal = document.getElementById("fitness-goal").value
  const level = document.getElementById("fitness-level").value
  const days = document.getElementById("workout-days").value
  const duration = document.getElementById("workout-duration").value

  if (!goal || !level || !days || !duration) {
    showToast("Please fill in all fields", "error")
    return
  }

  // Show loading
  showLoadingOverlay()

  // Simulate AI generation
  setTimeout(() => {
    hideLoadingOverlay()

    // Update plan overview
    document.getElementById("ai-plan-days").textContent = days
    document.getElementById("ai-plan-duration").textContent = duration
    document.getElementById("ai-plan-exercises").textContent = Math.floor(Math.random() * 5) + 6

    // Generate workout schedule
    generateWorkoutSchedule(goal, level, days, duration)

    // Show result
    document.getElementById("ai-workout-result").style.display = "block"
    showToast("AI workout plan generated!", "success")
  }, 2000)
}

function generateWorkoutSchedule(goal, level, days, duration) {
  const scheduleContainer = document.getElementById("ai-workout-schedule")
  const workouts = generateWorkoutData(goal, level, Number.parseInt(days))

  scheduleContainer.innerHTML = ""
  workouts.forEach((workout, index) => {
    const workoutDay = document.createElement("div")
    workoutDay.className = "workout-day"
    workoutDay.innerHTML = `
            <h4>Day ${index + 1}: ${workout.name}</h4>
            <div class="workout-exercises">
                ${workout.exercises
                  .map(
                    (exercise) => `
                    <div class="exercise-item">
                        <span class="exercise-name">${exercise.name}</span>
                        <span class="exercise-details">${exercise.sets} sets × ${exercise.reps} reps</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `
    scheduleContainer.appendChild(workoutDay)
  })
}

function generateWorkoutData(goal, level, days) {
  const workoutTemplates = {
    "weight-loss": [
      {
        name: "HIIT Cardio",
        exercises: [
          { name: "Burpees", sets: 3, reps: "10-15" },
          { name: "Mountain Climbers", sets: 3, reps: "20-30" },
          { name: "Jump Squats", sets: 3, reps: "15-20" },
        ],
      },
      {
        name: "Full Body Circuit",
        exercises: [
          { name: "Push-ups", sets: 3, reps: "8-12" },
          { name: "Squats", sets: 3, reps: "12-15" },
          { name: "Plank", sets: 3, reps: "30-60s" },
        ],
      },
    ],
    "muscle-gain": [
      {
        name: "Upper Body Strength",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "6-8" },
          { name: "Pull-ups", sets: 3, reps: "8-10" },
          { name: "Shoulder Press", sets: 3, reps: "8-10" },
        ],
      },
      {
        name: "Lower Body Strength",
        exercises: [
          { name: "Squats", sets: 4, reps: "6-8" },
          { name: "Deadlifts", sets: 4, reps: "6-8" },
          { name: "Lunges", sets: 3, reps: "10-12" },
        ],
      },
    ],
  }

  const templates = workoutTemplates[goal] || workoutTemplates["weight-loss"]
  const workouts = []

  for (let i = 0; i < days; i++) {
    workouts.push(templates[i % templates.length])
  }

  return workouts
}

function saveAIWorkoutPlan() {
  showToast("Workout plan saved to your library!", "success")
}

function regenerateAIWorkoutPlan() {
  generateAIWorkoutPlan()
}

// Nutrition Functions
function openNutritionModal() {
  openModal("nutrition-modal")
}

function calculateNutrition() {
  const age = document.getElementById("nutrition-age").value
  const gender = document.getElementById("nutrition-gender").value
  const height = document.getElementById("nutrition-height").value
  const weight = document.getElementById("nutrition-weight").value
  const activityLevel = document.getElementById("activity-level").value
  const goal = document.getElementById("nutrition-goal").value

  if (!age || !gender || !height || !weight || !activityLevel || !goal) {
    showToast("Please fill in all fields", "error")
    return
  }

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  }

  let calories = bmr * activityMultipliers[activityLevel]

  // Adjust for goal
  if (goal === "lose") {
    calories -= 500 // 500 calorie deficit
  } else if (goal === "gain") {
    calories += 500 // 500 calorie surplus
  }

  // Calculate macros
  const protein = Math.round(weight * 2.2) // 2.2g per kg
  const fat = Math.round((calories * 0.25) / 9) // 25% of calories
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

  // Update UI
  document.getElementById("daily-calories").textContent = Math.round(calories)
  document.getElementById("daily-protein").textContent = protein + "g"
  document.getElementById("daily-carbs").textContent = carbs + "g"
  document.getElementById("daily-fat").textContent = fat + "g"

  // Show results
  document.getElementById("nutrition-results").style.display = "block"
  showToast("Nutrition targets calculated!", "success")
}

function generateMealPlan() {
  const days = document.getElementById("meal-plan-days").value
  const diet = document.getElementById("meal-plan-diet").value

  showLoadingOverlay()

  setTimeout(() => {
    hideLoadingOverlay()
    showToast(`${days}-day ${diet} meal plan generated!`, "success")
  }, 1500)
}

function searchFood() {
  const query = document.getElementById("food-search").value
  if (query) {
    showToast(`Searching for "${query}"...`, "info")
    // Simulate search results
    setTimeout(() => {
      showToast("Food search results loaded", "success")
    }, 1000)
  }
}

function scanBarcode() {
  showToast("Barcode scanner would open here (camera access required)", "info")
}

function viewRecipe(recipeId) {
  showToast(`Opening recipe: ${recipeId}`, "info")
}

function addToMealPlan(recipeId) {
  showToast(`Recipe added to meal plan: ${recipeId}`, "success")
}

// Community Hub Functions
function openCommunityHubModal() {
  openModal("community-hub-modal")
}

function sendAIMessage() {
  const input = document.getElementById("ai-chat-input")
  const message = input.value.trim()

  if (message) {
    addChatMessage(message, "user")
    input.value = ""

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Based on your fitness goals, I recommend focusing on compound exercises like squats, deadlifts, and bench press.",
        "For nutrition, aim for a balanced diet with adequate protein (1.6-2.2g per kg body weight) and stay hydrated!",
        "Your workout schedule looks good! Make sure to include rest days for recovery.",
        "I'd suggest starting with 3-4 workouts per week and gradually increasing intensity.",
        "Remember, consistency is key! Small daily improvements lead to big results over time.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addChatMessage(randomResponse, "bot")
    }, 1000)
  }
}

function sendQuickMessage(message) {
  const input = document.getElementById("ai-chat-input")
  if (input) {
    input.value = message
    sendAIMessage()
  }

  // For chatbot
  const chatbotInput = document.getElementById("chatbot-input")
  if (chatbotInput) {
    chatbotInput.value = message
    sendChatbotMessage()
  }
}

function addChatMessage(message, sender) {
  const messagesContainer = document.getElementById("ai-chat-messages")
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${sender}`

  const avatar = document.createElement("div")
  avatar.className = "message-avatar"
  avatar.innerHTML = sender === "bot" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'

  const content = document.createElement("div")
  content.className = "message-content"
  content.innerHTML = `<p>${message}</p>`

  const time = document.createElement("div")
  time.className = "message-time"
  time.textContent = "Just now"

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(content)
  messageDiv.appendChild(time)

  messagesContainer.appendChild(messageDiv)
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Achievement System Functions
function openAchievementsModal() {
  openModal("achievements-modal")
}

// Chatbot Functions
function initializeChatbot() {
  const chatbotToggle = document.getElementById("chatbot-toggle")
  const chatbotClose = document.getElementById("chatbot-close")
  const chatbotWindow = document.getElementById("chatbot-window")
  const chatbotSend = document.getElementById("chatbot-send")
  const chatbotInput = document.getElementById("chatbot-input")

  chatbotToggle.addEventListener("click", () => {
    chatbotOpen = !chatbotOpen
    if (chatbotOpen) {
      chatbotWindow.classList.add("show")
    } else {
      chatbotWindow.classList.remove("show")
    }
  })

  chatbotClose.addEventListener("click", () => {
    chatbotOpen = false
    chatbotWindow.classList.remove("show")
  })

  chatbotSend.addEventListener("click", sendChatbotMessage)

  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendChatbotMessage()
    }
  })
}

function sendChatbotMessage() {
  const input = document.getElementById("chatbot-input")
  const message = input.value.trim()

  if (message) {
    addChatbotMessage(message, "user")
    input.value = ""

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "I'm here to help with your fitness journey! What would you like to know?",
        "That's a great question! Let me help you with that.",
        "Based on your goals, I recommend checking out our AI workout planner.",
        "Don't forget to stay hydrated and get enough rest!",
        "Would you like me to create a personalized workout plan for you?",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addChatbotMessage(randomResponse, "bot")
    }, 1000)
  }
}

function addChatbotMessage(message, sender) {
  const messagesContainer = document.getElementById("chatbot-messages")
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${sender}`

  const avatar = document.createElement("div")
  avatar.className = "message-avatar"
  avatar.innerHTML = sender === "bot" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'

  const content = document.createElement("div")
  content.className = "message-content"
  content.textContent = message

  const time = document.createElement("div")
  time.className = "message-time"
  time.textContent = "Just now"

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(content)
  messageDiv.appendChild(time)

  messagesContainer.appendChild(messageDiv)
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Payment System
function initializePaymentSystem() {
  setupPaymentMethods()
  setupCardFormatting()
}

function setupPaymentMethods() {
  const paymentMethods = document.querySelectorAll(".payment-method")

  paymentMethods.forEach((method) => {
    method.addEventListener("click", () => {
      // Remove active class from all methods
      paymentMethods.forEach((m) => m.classList.remove("active"))

      // Add active class to clicked method
      method.classList.add("active")

      // Check the radio button
      const radio = method.querySelector('input[type="radio"]')
      if (radio) {
        radio.checked = true
      }
    })
  })
}

function setupCardFormatting() {
  const cardNumber = document.getElementById("card-number")
  const expiryDate = document.getElementById("expiry-date")
  const cvv = document.getElementById("cvv")

  if (cardNumber) {
    cardNumber.addEventListener("input", (e) => {
      const value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
      const formattedValue = value.match(/.{1,4}/g)?.join(" ") || value
      e.target.value = formattedValue
    })
  }

  if (expiryDate) {
    expiryDate.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4)
      }
      e.target.value = value
    })
  }

  if (cvv) {
    cvv.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "")
    })
  }
}

function openPaymentModal(details) {
  document.getElementById("payment-service-name").textContent = details.service
  document.getElementById("payment-trainer").textContent = details.trainer
  document.getElementById("payment-date").textContent = details.date
  document.getElementById("payment-time").textContent = details.time
  document.getElementById("payment-amount").textContent = details.amount

  openModal("payment-modal")
}

function processPayment() {
  const cardNumber = document.getElementById("card-number").value
  const expiryDate = document.getElementById("expiry-date").value
  const cvv = document.getElementById("cvv").value
  const cardName = document.getElementById("card-name").value

  if (!cardNumber || !expiryDate || !cvv || !cardName) {
    showToast("Please fill in all payment details", "error")
    return
  }

  showLoadingOverlay()

  // Simulate payment processing
  setTimeout(() => {
    hideLoadingOverlay()
    closeModal(document.getElementById("payment-modal"))
    showToast("Payment successful! Booking confirmed.", "success")

    // Clear form
    document.getElementById("card-number").value = ""
    document.getElementById("expiry-date").value = ""
    document.getElementById("cvv").value = ""
    document.getElementById("card-name").value = ""
  }, 2000)
}

// Scroll Effects
function initializeScrollEffects() {
  // Back to top button
  const backToTop = document.getElementById("back-to-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("show")
    } else {
      backToTop.classList.remove("show")
    }
  })

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".feature-card, .trainer-card, .pricing-card")
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Dark Mode
function initializeDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle")
  const body = document.body

  // Apply saved dark mode preference
  if (darkMode) {
    body.setAttribute("data-theme", "dark")
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }

  darkModeToggle.addEventListener("click", () => {
    darkMode = !darkMode
    localStorage.setItem("darkMode", darkMode)

    if (darkMode) {
      body.setAttribute("data-theme", "dark")
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    } else {
      body.removeAttribute("data-theme")
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    }
  })
}

// Authentication System
function initializeAuth() {
  // Check for saved login state
  const savedUser = localStorage.getItem("fitlife-user")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    isAuthenticated = true
    updateAuthUI()
  }

  // Setup user profile dropdown
  const userProfile = document.getElementById("user-profile")
  if (userProfile) {
    userProfile.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  // Setup profile menu links
  setupProfileMenuLinks()
}

function setupProfileMenuLinks() {
  const dashboardLink = document.getElementById("dashboard-link")
  const profileLink = document.getElementById("profile-link")
  const progressLink = document.getElementById("progress-link")
  const bookingsLink = document.getElementById("bookings-link")
  const workoutsLink = document.getElementById("workouts-link")

  if (dashboardLink) {
    dashboardLink.addEventListener("click", (e) => {
      e.preventDefault()
      showToast("Dashboard feature coming soon!", "info")
    })
  }

  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      e.preventDefault()
      showToast("Profile settings coming soon!", "info")
    })
  }

  if (progressLink) {
    progressLink.addEventListener("click", (e) => {
      e.preventDefault()
      openProgressTracker()
    })
  }

  if (bookingsLink) {
    bookingsLink.addEventListener("click", (e) => {
      e.preventDefault()
      showToast("My bookings feature coming soon!", "info")
    })
  }

  if (workoutsLink) {
    workoutsLink.addEventListener("click", (e) => {
      e.preventDefault()
      openWorkoutPlanner()
    })
  }
}

// Progress Tracking System
let progressData = {
  workouts: [],
  weight: [],
  measurements: [],
  goals: [],
}

function initializeProgressTracking() {
  // Initialize progress data

  // Load saved progress data
  const savedProgress = localStorage.getItem("fitlife-progress")
  if (savedProgress) {
    progressData = JSON.parse(savedProgress)
  }

  setupProgressTabs()
}

function setupProgressTabs() {
  const progressTabs = document.querySelectorAll(".progress-tab-btn")
  const progressPanes = document.querySelectorAll(".progress-tab-pane")

  progressTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabType = tab.getAttribute("data-tab")

      // Update active tab
      progressTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Show corresponding pane
      progressPanes.forEach((pane) => pane.classList.remove("active"))
      const targetPane = document.getElementById(`${tabType}-progress-tab`)
      if (targetPane) {
        targetPane.classList.add("active")
      }
    })
  })
}

// Achievement System
const achievements = [
  {
    id: 1,
    name: "First Workout",
    description: "Complete your first workout session",
    icon: "fas fa-fire",
    points: 50,
    earned: true,
    earnedDate: "2024-11-15",
  },
  {
    id: 2,
    name: "Week Warrior",
    description: "Work out 5 days in a week",
    icon: "fas fa-calendar-week",
    points: 100,
    earned: true,
    earnedDate: "2024-11-22",
  },
  {
    id: 3,
    name: "Marathon Master",
    description: "Complete 50 cardio sessions",
    icon: "fas fa-running",
    points: 500,
    earned: false,
    progress: 20,
    target: 50,
  },
]

function initializeAchievements() {
  // Initialize achievements data
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number[data-target]")

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.ceil(current)
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target
      }
    }

    updateCounter()
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  })

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

// Demo Data Loading
function loadDemoData() {
  // Load demo user if not logged in
  if (!isAuthenticated) {
    // Pre-fill demo credentials
    const loginEmail = document.getElementById("login-email")
    const loginPassword = document.getElementById("login-password")

    if (loginEmail && loginPassword) {
      loginEmail.value = "demo@fitlife.com"
      loginPassword.value = "password"
    }
  }

  // Load demo schedule data
  loadScheduleData()

  console.log("Demo data loaded successfully")
}

function loadScheduleData() {
  // Demo schedule data
  const scheduleData = [
    {
      time: "06:00",
      class: "Morning Yoga",
      trainer: "Sarah Chen",
      duration: "60 min",
      difficulty: "beginner",
      spots: 8,
      day: "monday",
    },
    {
      time: "07:00",
      class: "HIIT Training",
      trainer: "Marcus Williams",
      duration: "45 min",
      difficulty: "advanced",
      spots: 2,
      day: "monday",
    },
    {
      time: "09:00",
      class: "Pilates",
      trainer: "Sarah Chen",
      duration: "50 min",
      difficulty: "intermediate",
      spots: 5,
      day: "monday",
    },
    {
      time: "18:00",
      class: "Strength Training",
      trainer: "Alex Johnson",
      duration: "60 min",
      difficulty: "intermediate",
      spots: 0,
      day: "monday",
    },
    {
      time: "19:00",
      class: "Zumba",
      trainer: "Maria Garcia",
      duration: "45 min",
      difficulty: "beginner",
      spots: 12,
      day: "monday",
    },

    {
      time: "06:30",
      class: "CrossFit",
      trainer: "Marcus Williams",
      duration: "60 min",
      difficulty: "advanced",
      spots: 3,
      day: "tuesday",
    },
    {
      time: "08:00",
      class: "Yoga Flow",
      trainer: "Sarah Chen",
      duration: "75 min",
      difficulty: "intermediate",
      spots: 6,
      day: "tuesday",
    },
    {
      time: "17:30",
      class: "Boxing",
      trainer: "Mike Torres",
      duration: "50 min",
      difficulty: "intermediate",
      spots: 4,
      day: "tuesday",
    },
    {
      time: "19:00",
      class: "Spin Class",
      trainer: "Lisa Park",
      duration: "45 min",
      difficulty: "beginner",
      spots: 8,
      day: "tuesday",
    },

    {
      time: "06:00",
      class: "Morning Stretch",
      trainer: "Sarah Chen",
      duration: "30 min",
      difficulty: "beginner",
      spots: 10,
      day: "wednesday",
    },
    {
      time: "07:00",
      class: "Functional Training",
      trainer: "Alex Johnson",
      duration: "55 min",
      difficulty: "intermediate",
      spots: 5,
      day: "wednesday",
    },
    {
      time: "18:00",
      class: "Hot Yoga",
      trainer: "Emma Wilson",
      duration: "90 min",
      difficulty: "intermediate",
      spots: 3,
      day: "wednesday",
    },
    {
      time: "19:30",
      class: "Aqua Fitness",
      trainer: "David Kim",
      duration: "45 min",
      difficulty: "beginner",
      spots: 15,
      day: "wednesday",
    },
  ]

  // Populate schedule table
  populateScheduleTable(scheduleData)
}

// Toast Notification System
// function showToast(message, type = 'info') { // Removed duplicated function
//     const toast = document.getElementById('toast');
//     const toastMessage = document.querySelector('.toast-message');
//     const toastIcon = document.querySelector('.toast-icon i');

//     // Set message
//     toastMessage.textContent = message;

//     // Set icon based on type
//     const icons = {
//         success: 'fas fa-check-circle',
//         error: 'fas fa-exclamation-circle',
//         warning: 'fas fa-exclamation-triangle',
//         info: 'fas fa-info-circle'
//     };

//     toastIcon.className = icons[type] || icons.info;

//     // Show toast
//     toast.classList.add('show');

//     // Auto hide after 3 seconds
//     setTimeout(() => {
//         toast.classList.remove('show');
//     }, 3000);

//     // Close button
//     const closeBtn = document.querySelector('.toast-close');
//     closeBtn.onclick = () => {
//         toast.classList.remove('show');
//     };
// }

// Contact Form Handler
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)

      // Simulate form submission
      showToast("Message sent successfully! We'll get back to you soon.", "success")
      contactForm.reset()
    })
  }
})

// Legal Modal Handler
function openLegalModal(type) {
  const content = {
    privacy: {
      title: "Privacy Policy",
      content:
        "This is a demo privacy policy. In a real application, this would contain the actual privacy policy content.",
    },
    terms: {
      title: "Terms of Service",
      content:
        "This is a demo terms of service. In a real application, this would contain the actual terms and conditions.",
    },
  }

  showToast(`${content[type].title} - Demo content`, "info")
}

// Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)

      showLoadingOverlay()

      // Simulate form submission
      setTimeout(() => {
        hideLoadingOverlay()
        showToast("Message sent successfully! We'll get back to you soon.", "success")
        contactForm.reset()
      }, 1500)
    })
  }
}

// Privacy and Terms Modals
function openPrivacyModal() {
  openModal("privacy-modal")
}

function openTermsModal() {
  openModal("terms-modal")
}

// Utility Functions
function showToast(message, type = "info") {
  const toast = document.getElementById("toast")
  const toastMessage = document.querySelector(".toast-message")
  const toastIcon = document.querySelector(".toast-icon i")

  // Set message
  toastMessage.textContent = message

  // Set icon based on type
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  toastIcon.className = icons[type] || icons.info

  // Show toast
  toast.classList.add("show")

  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)

  // Close button
  const closeBtn = document.querySelector(".toast-close")
  closeBtn.onclick = () => {
    toast.classList.remove("show")
  }
}

function showLoadingOverlay() {
  const overlay = document.getElementById("loading-overlay")
  overlay.classList.add("show")
}

function hideLoadingOverlay() {
  const overlay = document.getElementById("loading-overlay")
  overlay.classList.remove("show")
}

function initializeDemoData() {
  // Initialize demo user data
  const demoUser = {
    email: "demo@fitlife.com",
    name: "Demo User",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    membershipType: "Premium",
    joinDate: "2024-01-15",
  }

  // Auto-login demo user after 5 seconds if not authenticated
  setTimeout(() => {
    if (!isAuthenticated) {
      loginUser(demoUser)
      showToast("Demo account activated! Explore all features.", "info")
    }
  }, 5000)
}

// Input Formatting
function formatCardNumber(input) {
  const value = input.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
  const formattedValue = value.match(/.{1,4}/g)?.join(" ") || value
  input.value = formattedValue
}

function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, "")
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4)
  }
  input.value = value
}

// Initialize input formatting
document.addEventListener("DOMContentLoaded", () => {
  const cardNumberInput = document.getElementById("card-number")
  const expiryInput = document.getElementById("expiry-date")

  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", () => formatCardNumber(cardNumberInput))
  }

  if (expiryInput) {
    expiryInput.addEventListener("input", () => formatExpiryDate(expiryInput))
  }
})

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeTrainers()
  initializeMembership()
  initializeContactForm()
})

function initializeTrainers() {
  // Trainer data
  const trainers = [
    {
      name: "Alex Johnson",
      specialty: "Strength Training",
      image: "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg",
      bio: "Alex is a certified strength and conditioning specialist with over 10 years of experience.",
    },
    {
      name: "Maria Garcia",
      specialty: "Yoga & Pilates",
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg",
      bio: "Maria is a certified yoga and Pilates instructor with a passion for helping people improve their flexibility and balance.",
    },
    {
      name: "Mike Torres",
      specialty: "Boxing & Kickboxing",
      image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
      bio: "Mike is a former professional boxer and kickboxer with a passion for teaching people how to defend themselves and get in shape.",
    },
  ]

  // Trainer cards
  const trainersContainer = document.getElementById("trainers-container")
  trainers.forEach((trainer) => {
    const trainerCard = document.createElement("div")
    trainerCard.className = "trainer-card"
    trainerCard.innerHTML = `
            <img src="${trainer.image}" alt="${trainer.name}">
            <h3>${trainer.name}</h3>
            <p>${trainer.specialty}</p>
            <p>${trainer.bio}</p>
            <button class="btn btn-primary book-trainer" data-trainer="${trainer.name}">Book Now</button>
            <button class="btn btn-secondary view-schedule" data-trainer="${trainer.name}">View Schedule</button>
        `
    trainersContainer.appendChild(trainerCard)
  })

  // Trainer booking
  setupTrainerBooking()
}

function initializeMembership() {
  // Pricing data
  const pricingPlans = [
    {
      name: "Basic",
      monthly: 29,
      annual: 299,
      features: ["Gym Access", "Basic Classes", "Locker Room"],
    },
    {
      name: "Premium",
      monthly: 49,
      annual: 499,
      features: ["Gym Access", "All Classes", "Personal Training", "Nutrition Plan"],
    },
    {
      name: "VIP",
      monthly: 79,
      annual: 799,
      features: ["Gym Access", "All Classes", "Personal Training", "Nutrition Plan", "Spa & Massage"],
    },
  ]

  // Pricing cards
  const pricingContainer = document.getElementById("pricing-container")
  pricingPlans.forEach((plan) => {
    const pricingCard = document.createElement("div")
    pricingCard.className = "pricing-card"
    pricingCard.innerHTML = `
            <h3>${plan.name}</h3>
            <div class="price">
                <span class="amount monthly">${formatCurrency(plan.monthly)}</span>
                <span class="period monthly">/month</span>
                <span class="amount annual hidden">${formatCurrency(plan.annual)}</span>
                <span class="period annual hidden">/year</span>
            </div>
            <ul>
                ${plan.features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
            <button class="btn btn-primary select-plan" data-plan="${plan.name}">Select Plan</button>
        `
    pricingContainer.appendChild(pricingCard)
  })

  // Pricing toggle
  setupPricingToggle()

  // Membership selection
  setupMembershipSelection()
}

// Expose functions globally for onclick handlers
window.openSmartCheckinModal = openSmartCheckinModal
window.openProgressTrackingModal = openProgressTrackingModal
window.openAIWorkoutModal = openAIWorkoutModal
window.openNutritionModal = openNutritionModal
window.openCommunityHubModal = openCommunityHubModal
window.openAchievementsModal = openAchievementsModal
window.openPrivacyModal = openPrivacyModal
window.openTermsModal = openTermsModal
window.generateQRCode = generateQRCode
window.downloadQRCode = downloadQRCode
window.shareQRCode = shareQRCode
window.startQRScanner = startQRScanner
window.logWeight = logWeight
window.logMeasurements = logMeasurements
window.addGoal = addGoal
window.generateAIWorkoutPlan = generateAIWorkoutPlan
window.saveAIWorkoutPlan = saveAIWorkoutPlan
window.regenerateAIWorkoutPlan = regenerateAIWorkoutPlan
window.calculateNutrition = calculateNutrition
window.generateMealPlan = generateMealPlan
window.searchFood = searchFood
window.scanBarcode = scanBarcode
window.viewRecipe = viewRecipe
window.addToMealPlan = addToMealPlan
window.sendAIMessage = sendAIMessage
window.sendQuickMessage = sendQuickMessage
window.bookClass = bookClass
window.processPayment = processPayment

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Error Handling
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error)
  showToast("An error occurred. Please refresh the page.", "error")
})

// Performance Monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now()
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`)
})

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Export functions for global access
window.FitLifeGym = {
  openModal,
  closeModal,
  showToast,
  generateQRCode,
  downloadQRCode,
  shareQRCode,
  openProgressTracker,
  openWorkoutPlanner,
  openNutritionCalculator,
  openAchievements,
  bookClass,
  processPayment,
  toggleDarkMode,
  sendQuickMessage,
  openSmartCheckinModal,
  openProgressTrackingModal,
  openAIWorkoutModal,
  openNutritionModal,
  openCommunityHubModal,
  openAchievementsModal,
  openPrivacyModal,
  openTermsModal,
  startQRScanner,
  logWeight,
  logMeasurements,
  addGoal,
  generateAIWorkoutPlan,
  saveAIWorkoutPlan,
  regenerateAIWorkoutPlan,
  calculateNutrition,
  generateMealPlan,
  searchFood,
  scanBarcode,
  viewRecipe,
  addToMealPlan,
  sendAIMessage,
}

console.log("FitLife Gym JavaScript loaded successfully! 🏋️‍♂️")
