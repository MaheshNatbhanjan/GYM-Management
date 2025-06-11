// ===== GLOBAL VARIABLES =====
let currentUser = null
let currentTestimonial = 0
let testimonialInterval
let fabMenuOpen = false
let currentScheduleFilter = "all"
let currentScheduleView = "table"

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById("loading-screen")
const navbar = document.getElementById("navbar")
const mobileMenu = document.getElementById("mobile-menu")
const navMenu = document.getElementById("nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const backToTopBtn = document.getElementById("back-to-top")
const darkModeToggle = document.getElementById("dark-mode-toggle")
const mainFab = document.getElementById("main-fab")
const fabMenu = document.getElementById("fab-menu")

// Modal elements
const modals = document.querySelectorAll(".modal")
const closeBtns = document.querySelectorAll(".close-modal")
const authModal = document.getElementById("auth-modal")
const dashboardModal = document.getElementById("dashboard-modal")
const profileModal = document.getElementById("profile-modal")
const bookingsModal = document.getElementById("bookings-modal")
const workoutsModal = document.getElementById("workouts-modal")
const progressModal = document.getElementById("progress-modal")
const privacyModal = document.getElementById("privacy-modal")
const termsModal = document.getElementById("terms-modal")

// Form elements
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-form")
const contactForm = document.getElementById("contact-form")

// User profile elements
const loginBtn = document.getElementById("login-btn")
const userProfile = document.getElementById("user-profile")
const userName = document.getElementById("user-name")
const profileImg = document.getElementById("profile-img")
const logoutBtn = document.getElementById("logout-btn")

// Dashboard elements
const dashboardLink = document.getElementById("dashboard-link")
const profileLink = document.getElementById("profile-link")
const progressLink = document.getElementById("progress-link")
const bookingsLink = document.getElementById("bookings-link")
const workoutsLink = document.getElementById("workouts-link")

// Notification elements
const toast = document.getElementById("toast")
const notificationContainer = document.getElementById("notification-container")

// Health tools elements
const calculateBMIBtn = document.getElementById("calculate-bmi")
const calculateHRBtn = document.getElementById("calculate-hr")
const calculateCaloriesBtn = document.getElementById("calculate-calories")

// Schedule elements
const scheduleBody = document.getElementById("schedule-body")
const filterBtns = document.querySelectorAll(".filter-btn")
const viewBtns = document.querySelectorAll(".view-btn")
const scheduleTableView = document.querySelector(".schedule-table-view")
const scheduleCalendarView = document.querySelector(".schedule-calendar-view")

// Virtual tour elements
const tourBtns = document.querySelectorAll(".tour-btn")
const tourImages = document.querySelectorAll(".tour-image")

// Pricing toggle
const pricingToggle = document.getElementById("pricing-toggle")

// ===== SAMPLE DATA =====
const scheduleData = [
  {
    id: 1,
    time: "06:00",
    class: "Morning Yoga",
    type: "yoga",
    trainer: "Sarah Chen",
    duration: "60 min",
    difficulty: "beginner",
    spots: 15,
    maxSpots: 20,
    day: "monday",
  },
  {
    id: 2,
    time: "07:30",
    class: "HIIT Training",
    type: "hiit",
    trainer: "Marcus Williams",
    duration: "45 min",
    difficulty: "advanced",
    spots: 3,
    maxSpots: 15,
    day: "monday",
  },
  {
    id: 3,
    time: "09:00",
    class: "Strength Training",
    type: "strength",
    trainer: "Alex Johnson",
    duration: "75 min",
    difficulty: "intermediate",
    spots: 8,
    maxSpots: 12,
    day: "monday",
  },
  {
    id: 4,
    time: "18:00",
    class: "Cardio Blast",
    type: "cardio",
    trainer: "Sarah Chen",
    duration: "50 min",
    difficulty: "intermediate",
    spots: 12,
    maxSpots: 25,
    day: "monday",
  },
  {
    id: 5,
    time: "06:30",
    class: "Power Yoga",
    type: "yoga",
    trainer: "Sarah Chen",
    duration: "60 min",
    difficulty: "intermediate",
    spots: 10,
    maxSpots: 18,
    day: "tuesday",
  },
  {
    id: 6,
    time: "08:00",
    class: "CrossFit",
    type: "strength",
    trainer: "Marcus Williams",
    duration: "60 min",
    difficulty: "advanced",
    spots: 5,
    maxSpots: 10,
    day: "tuesday",
  },
]

const testimonials = [
  {
    id: 1,
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    text: "FitLife has completely transformed my approach to fitness. The trainers are incredibly knowledgeable and supportive, and the facilities are top-notch. I've never felt stronger or more confident!",
    rating: 5,
  },
  {
    id: 2,
    name: "David Thompson",
    role: "Software Engineer",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    text: "As someone who works long hours, I appreciate the 24/7 access and flexible class schedules. The AI workout plans have helped me stay consistent with my fitness goals even with a busy schedule.",
    rating: 5,
  },
  {
    id: 3,
    name: "Maria Santos",
    role: "Teacher",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    text: "The community at FitLife is amazing! Everyone is so encouraging and welcoming. I've made great friends here and achieved fitness goals I never thought possible. Highly recommend!",
    rating: 5,
  },
]

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = "info") {
  const toastIcon = toast.querySelector(".toast-icon")
  const toastMessage = toast.querySelector(".toast-message")

  toast.className = `toast ${type}`
  toastMessage.textContent = message

  switch (type) {
    case "success":
      toastIcon.className = "toast-icon fas fa-check-circle"
      break
    case "error":
      toastIcon.className = "toast-icon fas fa-exclamation-circle"
      break
    case "warning":
      toastIcon.className = "toast-icon fas fa-exclamation-triangle"
      break
    case "info":
    default:
      toastIcon.className = "toast-icon fas fa-info-circle"
      break
  }

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 4000)
}

function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return null
  }
}

function animateCounter(element, target, duration = 2000) {
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 16)
}

function formatTime(time) {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// ===== MODAL FUNCTIONS =====
function openModal(modal) {
  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function closeModal(modal) {
  modal.classList.remove("show")
  document.body.style.overflow = ""
}

function closeAllModals() {
  modals.forEach((modal) => {
    closeModal(modal)
  })
}

// ===== LEGAL MODAL FUNCTIONS =====
function openLegalModal(type) {
  if (type === "privacy") {
    openModal(privacyModal)
  } else if (type === "terms") {
    openModal(termsModal)
  }
}

function closeLegalModal(type) {
  if (type === "privacy") {
    closeModal(privacyModal)
  } else if (type === "terms") {
    closeModal(termsModal)
  }
}

// ===== AUTHENTICATION FUNCTIONS =====
function simulateLogin(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userData = {
        id: "user_" + Date.now(),
        name: email.split("@")[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split("@")[0])}&background=random`,
        membershipType: "Premium",
        joinDate: new Date().toISOString(),
      }
      resolve(userData)
    }, 1500)
  })
}

function loginUser(userData) {
  currentUser = userData
  saveToLocalStorage("fitlife_user", userData)
  updateUIForLoggedInUser()
  closeAllModals()
  showToast(`Welcome back, ${userData.name}!`, "success")
}

function logoutUser() {
  currentUser = null
  localStorage.removeItem("fitlife_user")
  updateUIForLoggedOutUser()
  showToast("You have been logged out successfully", "info")
}

function updateUIForLoggedInUser() {
  if (loginBtn) loginBtn.classList.add("hidden")
  if (userProfile) userProfile.classList.remove("hidden")
  if (userName) userName.textContent = currentUser.name
  if (profileImg) profileImg.src = currentUser.avatar
}

function updateUIForLoggedOutUser() {
  if (loginBtn) loginBtn.classList.remove("hidden")
  if (userProfile) userProfile.classList.add("hidden")
}

// ===== DASHBOARD FUNCTIONS =====
function openDashboard() {
  if (!currentUser) {
    showToast("Please login to view dashboard", "error")
    openModal(authModal)
    return
  }
  populateDashboard()
  openModal(dashboardModal)
}

function openProfile() {
  if (!currentUser) {
    showToast("Please login to view profile", "error")
    openModal(authModal)
    return
  }
  openModal(profileModal)
}

function openBookings() {
  if (!currentUser) {
    showToast("Please login to view bookings", "error")
    openModal(authModal)
    return
  }
  populateBookings()
  openModal(bookingsModal)
}

function openProgressTracker() {
  if (!currentUser) {
    showToast("Please login to view progress", "error")
    openModal(authModal)
    return
  }
  populateProgress()
  openModal(progressModal)
}

function populateDashboard() {
  // Animate dashboard stats
  const totalWorkouts = document.getElementById("total-workouts")
  const caloriesBurnedTotal = document.getElementById("calories-burned-total")
  const workoutHours = document.getElementById("workout-hours")
  const achievementsEarned = document.getElementById("achievements-earned")

  if (totalWorkouts) animateCounter(totalWorkouts, 47)
  if (caloriesBurnedTotal) animateCounter(caloriesBurnedTotal, 12450)
  if (workoutHours) animateCounter(workoutHours, 89)
  if (achievementsEarned) animateCounter(achievementsEarned, 15)

  // Populate recent activity
  const recentActivity = document.getElementById("recent-activity")
  if (recentActivity) {
    recentActivity.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-dumbbell"></i>
                </div>
                <div class="activity-info">
                    <div class="activity-title">Strength Training</div>
                    <div class="activity-time">2 hours ago</div>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-running"></i>
                </div>
                <div class="activity-info">
                    <div class="activity-title">Cardio Session</div>
                    <div class="activity-time">Yesterday</div>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="activity-info">
                    <div class="activity-title">Yoga Class</div>
                    <div class="activity-time">2 days ago</div>
                </div>
            </div>
        `
  }

  // Populate upcoming classes
  const upcomingClasses = document.getElementById("upcoming-classes")
  if (upcomingClasses) {
    upcomingClasses.innerHTML = `
            <div class="upcoming-class">
                <div class="class-info">
                    <div class="class-title">HIIT Training</div>
                    <div class="class-details">Tomorrow, 7:30 AM with Marcus Williams</div>
                </div>
            </div>
            <div class="upcoming-class">
                <div class="class-info">
                    <div class="class-title">Yoga Flow</div>
                    <div class="class-details">Friday, 6:00 PM with Sarah Chen</div>
                </div>
            </div>
        `
  }
}

function populateBookings() {
  // Populate class bookings
  const classBookingsList = document.getElementById("class-bookings-list")
  if (classBookingsList) {
    classBookingsList.innerHTML = `
            <div class="booking-item">
                <div class="booking-header">
                    <div>
                        <div class="booking-title">HIIT Training</div>
                        <div class="booking-status confirmed">Confirmed</div>
                    </div>
                </div>
                <div class="booking-details">
                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Tomorrow, Dec 15</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clock"></i>
                        <span>7:30 AM - 8:15 AM</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-user"></i>
                        <span>Marcus Williams</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-cancel">Cancel</button>
                    <button class="btn btn-reschedule">Reschedule</button>
                </div>
            </div>
            <div class="booking-item">
                <div class="booking-header">
                    <div>
                        <div class="booking-title">Yoga Flow</div>
                        <div class="booking-status confirmed">Confirmed</div>
                    </div>
                </div>
                <div class="booking-details">
                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Friday, Dec 17</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clock"></i>
                        <span>6:00 PM - 7:00 PM</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-user"></i>
                        <span>Sarah Chen</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-cancel">Cancel</button>
                    <button class="btn btn-reschedule">Reschedule</button>
                </div>
            </div>
        `
  }

  // Populate trainer bookings
  const trainerBookingsList = document.getElementById("trainer-bookings-list")
  if (trainerBookingsList) {
    trainerBookingsList.innerHTML = `
            <div class="booking-item">
                <div class="booking-header">
                    <div>
                        <div class="booking-title">Personal Training Session</div>
                        <div class="booking-status confirmed">Confirmed</div>
                    </div>
                </div>
                <div class="booking-details">
                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Monday, Dec 20</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-clock"></i>
                        <span>10:00 AM - 11:00 AM</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-user"></i>
                        <span>Alex Johnson</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-cancel">Cancel</button>
                    <button class="btn btn-reschedule">Reschedule</button>
                </div>
            </div>
        `
  }
}

function populateProgress() {
  // Set current date for weight input
  const weightDate = document.getElementById("weight-date")
  if (weightDate) {
    weightDate.value = new Date().toISOString().split("T")[0]
  }

  // Populate weight history
  const weightHistory = document.getElementById("weight-history")
  if (weightHistory) {
    weightHistory.innerHTML = `
            <div class="weight-entry">
                <span class="weight-date">Dec 10, 2024</span>
                <span class="weight-value">72.5 kg</span>
            </div>
            <div class="weight-entry">
                <span class="weight-date">Dec 5, 2024</span>
                <span class="weight-value">73.0 kg</span>
            </div>
            <div class="weight-entry">
                <span class="weight-date">Nov 30, 2024</span>
                <span class="weight-value">73.8 kg</span>
            </div>
        `
  }

  // Populate measurements history
  const measurementsHistory = document.getElementById("measurements-history")
  if (measurementsHistory) {
    measurementsHistory.innerHTML = `
            <div class="measurements-entry">
                <h5>Latest Measurements (Dec 10, 2024)</h5>
                <div class="measurements-grid">
                    <div class="measurement">
                        <span class="label">Chest:</span>
                        <span class="value">98 cm</span>
                    </div>
                    <div class="measurement">
                        <span class="label">Waist:</span>
                        <span class="value">82 cm</span>
                    </div>
                    <div class="measurement">
                        <span class="label">Hips:</span>
                        <span class="value">95 cm</span>
                    </div>
                    <div class="measurement">
                        <span class="label">Arms:</span>
                        <span class="value">35 cm</span>
                    </div>
                </div>
            </div>
        `
  }
}

// ===== FEATURE FUNCTIONS =====
function generateQRCode() {
  if (!currentUser) {
    showToast("Please login to generate QR code", "error")
    openModal(authModal)
    return
  }
  showToast("QR code generated successfully!", "success")
}

function openWorkoutPlanner() {
  showToast("Workout planner feature coming soon!", "info")
}

function openNutritionCalculator() {
  showToast("Nutrition calculator feature coming soon!", "info")
}

function openLiveChat() {
  showToast("Live chat feature coming soon!", "info")
}

function openAchievements() {
  showToast("Achievements feature coming soon!", "info")
}

// ===== HEALTH TOOLS FUNCTIONS =====
function calculateBMI() {
  const height = Number.parseFloat(document.getElementById("height").value)
  const weight = Number.parseFloat(document.getElementById("weight").value)

  if (!height || !weight) {
    showToast("Please enter both height and weight", "warning")
    return
  }

  const bmi = weight / (height / 100) ** 2
  const bmiValue = document.getElementById("bmi-value")
  const bmiCategory = document.getElementById("bmi-category")

  if (bmiValue && bmiCategory) {
    bmiValue.textContent = bmi.toFixed(1)

    let category = ""
    if (bmi < 18.5) {
      category = "Underweight"
    } else if (bmi < 25) {
      category = "Normal weight"
    } else if (bmi < 30) {
      category = "Overweight"
    } else {
      category = "Obese"
    }

    bmiCategory.textContent = category
  }
}

function calculateHeartRateZones() {
  const age = Number.parseInt(document.getElementById("age").value)

  if (!age) {
    showToast("Please enter your age", "warning")
    return
  }

  const maxHR = 220 - age
  const hrZones = document.getElementById("hr-zones")

  if (hrZones) {
    hrZones.innerHTML = `
            <div class="hr-zone zone-1">
                <span>Zone 1 (50-60%)</span>
                <span>${Math.round(maxHR * 0.5)}-${Math.round(maxHR * 0.6)} bpm</span>
            </div>
            <div class="hr-zone zone-2">
                <span>Zone 2 (60-70%)</span>
                <span>${Math.round(maxHR * 0.6)}-${Math.round(maxHR * 0.7)} bpm</span>
            </div>
            <div class="hr-zone zone-3">
                <span>Zone 3 (70-80%)</span>
                <span>${Math.round(maxHR * 0.7)}-${Math.round(maxHR * 0.8)} bpm</span>
            </div>
            <div class="hr-zone zone-4">
                <span>Zone 4 (80-90%)</span>
                <span>${Math.round(maxHR * 0.8)}-${Math.round(maxHR * 0.9)} bpm</span>
            </div>
            <div class="hr-zone zone-5">
                <span>Zone 5 (90-100%)</span>
                <span>${Math.round(maxHR * 0.9)}-${Math.round(maxHR)} bpm</span>
            </div>
        `
  }
}

function calculateCalories() {
  const weight = Number.parseFloat(document.getElementById("cal-weight").value)
  const duration = Number.parseInt(document.getElementById("workout-duration").value)
  const workoutType = document.getElementById("workout-type").value

  if (!weight || !duration) {
    showToast("Please enter weight and duration", "warning")
    return
  }

  // MET values for different workout types
  const metValues = {
    cardio: 8,
    strength: 6,
    yoga: 3,
    hiit: 10,
  }

  const met = metValues[workoutType] || 6
  const calories = Math.round((met * weight * duration) / 60)

  const caloriesBurned = document.getElementById("calories-burned")
  if (caloriesBurned) {
    caloriesBurned.textContent = calories
  }
}

// ===== SCHEDULE FUNCTIONS =====
function populateSchedule(filter = "all") {
  if (!scheduleBody) return

  let filteredData = scheduleData
  if (filter !== "all") {
    filteredData = scheduleData.filter((item) => item.day === filter)
  }

  scheduleBody.innerHTML = filteredData
    .map((item) => {
      const spotsClass = item.spots <= 3 ? "low" : item.spots === 0 ? "full" : ""
      const difficultyClass = item.difficulty

      return `
            <tr>
                <td>${formatTime(item.time)}</td>
                <td>
                    <div class="class-name">${item.class}</div>
                    <span class="class-type ${item.type}">${item.type}</span>
                </td>
                <td>${item.trainer}</td>
                <td>${item.duration}</td>
                <td>
                    <div class="difficulty">
                        <div class="difficulty-dot ${difficultyClass}"></div>
                        <span>${item.difficulty}</span>
                    </div>
                </td>
                <td>
                    <span class="spots-count ${spotsClass}">${item.spots}/${item.maxSpots}</span>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="bookClass(${item.id})" ${item.spots === 0 ? "disabled" : ""}>
                        ${item.spots === 0 ? "Full" : "Book"}
                    </button>
                </td>
            </tr>
        `
    })
    .join("")
}

function bookClass(classId) {
  if (!currentUser) {
    showToast("Please login to book classes", "error")
    openModal(authModal)
    return
  }

  const classItem = scheduleData.find((item) => item.id === classId)
  if (classItem && classItem.spots > 0) {
    classItem.spots--
    populateSchedule(currentScheduleFilter)
    showToast(`Successfully booked ${classItem.class}!`, "success")
  }
}

function filterSchedule(day) {
  currentScheduleFilter = day

  // Update active filter button
  filterBtns.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.day === day) {
      btn.classList.add("active")
    }
  })

  populateSchedule(day)
}

function switchScheduleView(view) {
  currentScheduleView = view

  // Update active view button
  viewBtns.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.view === view) {
      btn.classList.add("active")
    }
  })

  // Switch views
  if (view === "table") {
    scheduleTableView.classList.add("active")
    scheduleCalendarView.classList.remove("active")
  } else {
    scheduleTableView.classList.remove("active")
    scheduleCalendarView.classList.add("active")
    populateCalendarView()
  }
}

function populateCalendarView() {
  const calendarGrid = document.getElementById("calendar-grid")
  if (!calendarGrid) return

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  calendarGrid.innerHTML = days
    .map((day) => {
      const dayClasses = scheduleData.filter((item) => item.day === day.toLowerCase())

      return `
            <div class="calendar-day">
                <div class="calendar-day-header">${day}</div>
                ${dayClasses
                  .map(
                    (classItem) => `
                    <div class="calendar-class" onclick="bookClass(${classItem.id})">
                        <div class="class-time">${formatTime(classItem.time)}</div>
                        <div class="class-name">${classItem.class}</div>
                        <div class="class-trainer">${classItem.trainer}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `
    })
    .join("")
}

// ===== VIRTUAL TOUR FUNCTIONS =====
function switchTourArea(area) {
  // Update active tour button
  tourBtns.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.area === area) {
      btn.classList.add("active")
    }
  })

  // Switch tour images
  tourImages.forEach((img) => {
    img.classList.remove("active")
    if (img.dataset.area === area) {
      img.classList.add("active")
    }
  })
}

// ===== TESTIMONIALS FUNCTIONS =====
function initTestimonials() {
  const testimonialTrack = document.getElementById("testimonial-track")
  const testimonialIndicators = document.getElementById("testimonial-indicators")

  if (!testimonialTrack || !testimonialIndicators) return

  // Populate testimonials
  testimonialTrack.innerHTML = testimonials
    .map(
      (testimonial) => `
        <div class="testimonial">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-img">
            <p class="testimonial-text">${testimonial.text}</p>
            <h4 class="testimonial-name">${testimonial.name}</h4>
            <p class="testimonial-role">${testimonial.role}</p>
            <div class="testimonial-rating">
                ${"★".repeat(testimonial.rating)}
            </div>
        </div>
    `,
    )
    .join("")

  // Populate indicators
  testimonialIndicators.innerHTML = testimonials
    .map(
      (_, index) => `
        <div class="indicator ${index === 0 ? "active" : ""}" onclick="goToTestimonial(${index})"></div>
    `,
    )
    .join("")

  // Auto-rotate testimonials
  startTestimonialRotation()
}

function goToTestimonial(index) {
  currentTestimonial = index
  const testimonialTrack = document.getElementById("testimonial-track")
  const indicators = document.querySelectorAll(".indicator")

  if (testimonialTrack) {
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`
  }

  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i === index)
  })
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length
  goToTestimonial(currentTestimonial)
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length
  goToTestimonial(currentTestimonial)
}

function startTestimonialRotation() {
  testimonialInterval = setInterval(nextTestimonial, 5000)
}

function stopTestimonialRotation() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval)
  }
}

// ===== PRICING FUNCTIONS =====
function togglePricing() {
  const monthlyElements = document.querySelectorAll(".monthly")
  const annualElements = document.querySelectorAll(".annual")
  const toggleLabels = document.querySelectorAll(".toggle-label")

  monthlyElements.forEach((el) => el.classList.toggle("hidden"))
  annualElements.forEach((el) => el.classList.toggle("hidden"))

  toggleLabels.forEach((label) => label.classList.toggle("active"))
}

function selectPlan(plan) {
  if (!currentUser) {
    showToast("Please login to select a membership plan", "error")
    openModal(authModal)
    return
  }
  showToast(`${plan} plan selected! Redirecting to payment...`, "success")
}

// ===== NAVIGATION FUNCTIONS =====
function toggleMobileMenu() {
  if (!mobileMenu || !navMenu) return

  mobileMenu.classList.toggle("active")
  navMenu.classList.toggle("active")

  const bars = document.querySelectorAll(".bar")
  if (navMenu.classList.contains("active")) {
    bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)"
    bars[1].style.opacity = "0"
    bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)"
  } else {
    bars[0].style.transform = "none"
    bars[1].style.opacity = "1"
    bars[2].style.transform = "none"
  }
}

function handleScroll() {
  // Add/remove scrolled class to navbar
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  // Show/hide back to top button
  if (window.scrollY > 500) {
    backToTopBtn.classList.add("show")
  } else {
    backToTopBtn.classList.remove("show")
  }

  // Update active nav link based on scroll position
  const sections = document.querySelectorAll("section")
  const scrollPosition = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// ===== DARK MODE FUNCTIONS =====
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  const isDarkMode = document.body.classList.contains("dark-mode")

  const icon = darkModeToggle.querySelector("i")
  if (icon) {
    icon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon"
  }

  saveToLocalStorage("fitlife_dark_mode", isDarkMode)
  showToast(`${isDarkMode ? "Dark" : "Light"} mode activated`, "info")
}

function initDarkMode() {
  const savedDarkMode = getFromLocalStorage("fitlife_dark_mode")
  if (savedDarkMode) {
    document.body.classList.add("dark-mode")
    const icon = darkModeToggle?.querySelector("i")
    if (icon) {
      icon.className = "fas fa-sun"
    }
  }
}

// ===== FAB MENU FUNCTIONS =====
function toggleFabMenu() {
  fabMenuOpen = !fabMenuOpen

  if (mainFab) {
    mainFab.classList.toggle("active", fabMenuOpen)
  }

  if (fabMenu) {
    fabMenu.classList.toggle("active", fabMenuOpen)
  }
}

// ===== TAB FUNCTIONS =====
function switchTab(tabName, tabType = "auth") {
  if (tabType === "auth") {
    // Auth modal tabs
    const tabBtns = document.querySelectorAll(".tab-btn")
    const tabPanes = document.querySelectorAll(".tab-pane")

    tabBtns.forEach((btn) => {
      btn.classList.remove("active")
      if (btn.dataset.tab === tabName) {
        btn.classList.add("active")
      }
    })

    tabPanes.forEach((pane) => {
      pane.classList.remove("active")
      if (pane.id === `${tabName}-tab`) {
        pane.classList.add("active")
      }
    })
  } else if (tabType === "bookings") {
    // Bookings modal tabs
    const tabBtns = document.querySelectorAll(".bookings-tab-btn")
    const tabPanes = document.querySelectorAll(".bookings-tab-pane")

    tabBtns.forEach((btn) => {
      btn.classList.remove("active")
      if (btn.dataset.tab === tabName) {
        btn.classList.add("active")
      }
    })

    tabPanes.forEach((pane) => {
      pane.classList.remove("active")
      if (pane.id === `${tabName}-bookings`) {
        pane.classList.add("active")
      }
    })
  } else if (tabType === "progress") {
    // Progress modal tabs
    const tabBtns = document.querySelectorAll(".progress-tab-btn")
    const tabPanes = document.querySelectorAll(".progress-tab-pane")

    tabBtns.forEach((btn) => {
      btn.classList.remove("active")
      if (btn.dataset.tab === tabName) {
        btn.classList.add("active")
      }
    })

    tabPanes.forEach((pane) => {
      pane.classList.remove("active")
      if (pane.id === `${tabName}-progress`) {
        pane.classList.add("active")
      }
    })
  }
}

// ===== FORM HANDLERS =====
function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Simulate form submission
  showToast("Message sent successfully! We'll get back to you within 24 hours.", "success")
  e.target.reset()
}

function handleLoginForm(e) {
  e.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  if (!email || !password) {
    showToast("Please fill in all fields", "warning")
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...'
  submitBtn.disabled = true

  simulateLogin(email, password)
    .then((userData) => {
      loginUser(userData)
    })
    .catch((error) => {
      showToast("Login failed. Please try again.", "error")
    })
    .finally(() => {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    })
}

function handleSignupForm(e) {
  e.preventDefault()

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

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...'
  submitBtn.disabled = true

  // Simulate signup
  setTimeout(() => {
    const userData = {
      id: "user_" + Date.now(),
      name: `${firstName} ${lastName}`,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=random`,
      membershipType: "Basic",
      joinDate: new Date().toISOString(),
    }

    loginUser(userData)
    showToast("Account created successfully!", "success")

    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }, 1500)
}

// ===== HERO STATS ANIMATION =====
function animateHeroStats() {
  const statNumbers = document.querySelectorAll(".hero-stats .stat-number")

  statNumbers.forEach((stat) => {
    const target = Number.parseInt(stat.dataset.target)
    animateCounter(stat, target, 3000)
  })
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  // Hide loading screen
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden")
    }
  }, 2000)

  // Initialize dark mode
  initDarkMode()

  // Check for saved user
  const savedUser = getFromLocalStorage("fitlife_user")
  if (savedUser) {
    currentUser = savedUser
    updateUIForLoggedInUser()
  }

  // Animate hero stats when page loads
  setTimeout(animateHeroStats, 1000)

  // Initialize testimonials
  initTestimonials()

  // Populate initial schedule
  populateSchedule()

  // Navigation events
  if (mobileMenu) {
    mobileMenu.addEventListener("click", toggleMobileMenu)
  }

  window.addEventListener("scroll", handleScroll)

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", scrollToTop)
  }

  // Dark mode toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode)
  }

  // FAB menu
  if (mainFab) {
    mainFab.addEventListener("click", toggleFabMenu)
  }

  // Modal close buttons
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal")
      closeModal(modal)
    })
  })

  // Close modals when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal)
      }
    })
  })

  // Auth modal events
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal(authModal))
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser)
  }

  // Dashboard, Profile, Bookings, Progress links
  if (dashboardLink) {
    dashboardLink.addEventListener("click", (e) => {
      e.preventDefault()
      openDashboard()
    })
  }

  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      e.preventDefault()
      openProfile()
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
      openBookings()
    })
  }

  // Form submissions
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginForm)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignupForm)
  }

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Health tools events
  if (calculateBMIBtn) {
    calculateBMIBtn.addEventListener("click", calculateBMI)
  }

  if (calculateHRBtn) {
    calculateHRBtn.addEventListener("click", calculateHeartRateZones)
  }

  if (calculateCaloriesBtn) {
    calculateCaloriesBtn.addEventListener("click", calculateCalories)
  }

  // Schedule filter events
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterSchedule(btn.dataset.day)
    })
  })

  // Schedule view toggle events
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchScheduleView(btn.dataset.view)
    })
  })

  // Virtual tour events
  tourBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTourArea(btn.dataset.area)
    })
  })

  // Pricing toggle
  if (pricingToggle) {
    pricingToggle.addEventListener("change", togglePricing)
  }

  // Plan selection buttons
  document.querySelectorAll(".select-plan").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectPlan(btn.dataset.plan)
    })
  })

  // Trainer booking buttons
  document.querySelectorAll(".book-trainer").forEach((btn) => {
    btn.addEventListener("click", () => {
      const trainer = btn.dataset.trainer
      if (!currentUser) {
        showToast("Please login to book trainer sessions", "error")
        openModal(authModal)
        return
      }
      showToast(`Booking session with ${trainer}...`, "success")
    })
  })

  // Auth tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab, "auth")
    })
  })

  // Bookings tab switching
  document.querySelectorAll(".bookings-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab, "bookings")
    })
  })

  // Progress tab switching
  document.querySelectorAll(".progress-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab, "progress")
    })
  })

  // Testimonial navigation
  const prevTestimonialBtn = document.getElementById("prev-testimonial")
  const nextTestimonialBtn = document.getElementById("next-testimonial")

  if (prevTestimonialBtn) {
    prevTestimonialBtn.addEventListener("click", prevTestimonial)
  }

  if (nextTestimonialBtn) {
    nextTestimonialBtn.addEventListener("click", nextTestimonial)
  }

  // Progress tracking events
  const logWeightBtn = document.getElementById("log-weight")
  const logMeasurementsBtn = document.getElementById("log-measurements")

  if (logWeightBtn) {
    logWeightBtn.addEventListener("click", () => {
      const weight = document.getElementById("weight-input").value
      const date = document.getElementById("weight-date").value

      if (weight && date) {
        showToast("Weight logged successfully!", "success")
        document.getElementById("weight-input").value = ""
      } else {
        showToast("Please enter weight and date", "warning")
      }
    })
  }

  if (logMeasurementsBtn) {
    logMeasurementsBtn.addEventListener("click", () => {
      const chest = document.getElementById("chest-measurement").value
      const waist = document.getElementById("waist-measurement").value
      const hips = document.getElementById("hips-measurement").value
      const arms = document.getElementById("arms-measurement").value

      if (chest || waist || hips || arms) {
        showToast("Measurements logged successfully!", "success")
        document.getElementById("chest-measurement").value = ""
        document.getElementById("waist-measurement").value = ""
        document.getElementById("hips-measurement").value = ""
        document.getElementById("arms-measurement").value = ""
      } else {
        showToast("Please enter at least one measurement", "warning")
      }
    })
  }

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" })

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains("active")) {
          toggleMobileMenu()
        }
      }
    })
  })

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape key to close modals
    if (e.key === "Escape") {
      closeAllModals()
    }

    // Ctrl/Cmd + K to open search (placeholder)
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      showToast("Search feature coming soon!", "info")
    }
  })

  // Pause testimonial rotation on hover
  const testimonialsContainer = document.querySelector(".testimonials-container")
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener("mouseenter", stopTestimonialRotation)
    testimonialsContainer.addEventListener("mouseleave", startTestimonialRotation)
  }

  console.log("FitLife Gym website initialized successfully!")
})

// ===== GLOBAL FUNCTIONS FOR ONCLICK HANDLERS =====
window.generateQRCode = generateQRCode
window.openProgressTracker = openProgressTracker
window.openWorkoutPlanner = openWorkoutPlanner
window.openNutritionCalculator = openNutritionCalculator
window.openLiveChat = openLiveChat
window.openAchievements = openAchievements
window.openDashboard = openDashboard
window.openProfile = openProfile
window.openBookings = openBookings
window.openLegalModal = openLegalModal
window.closeLegalModal = closeLegalModal
window.bookClass = bookClass
window.goToTestimonial = goToTestimonial
window.selectPlan = selectPlan
window.closeAllModals = closeAllModals

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Loading Screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    loadingScreen.style.opacity = "0"
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }, 1500)

  // Mobile Menu Toggle
  const mobileMenu = document.getElementById("mobile-menu")
  const navMenu = document.getElementById("nav-menu")

  mobileMenu.addEventListener("click", function () {
    this.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Navbar Scroll Effect
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar")
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Active Navigation Link
  const sections = document.querySelectorAll("section")
  const navItems = document.querySelectorAll(".nav-link")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active")
      }
    })
  })

  // Hero Stats Counter Animation
  const statNumbers = document.querySelectorAll(".stat-number")

  function animateStats() {
    statNumbers.forEach((stat) => {
      const target = Number.parseInt(stat.getAttribute("data-target"))
      const duration = 2000 // 2 seconds
      const step = target / (duration / 16) // 60fps

      let current = 0
      const counter = setInterval(() => {
        current += step
        stat.textContent = Math.floor(current)

        if (current >= target) {
          stat.textContent = target
          clearInterval(counter)
        }
      }, 16)
    })
  }

  // Trigger stats animation when in viewport
  const heroSection = document.getElementById("home")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats()
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  observer.observe(heroSection)

  // Virtual Tour Functionality
  const tourBtns = document.querySelectorAll(".tour-btn")
  const tourImages = document.querySelectorAll(".tour-image")

  tourBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const area = this.getAttribute("data-area")

      // Update active button
      tourBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Update active image
      tourImages.forEach((img) => {
        img.classList.remove("active")
        if (img.getAttribute("data-area") === area) {
          img.classList.add("active")
        }
      })
    })
  })

  // Hotspot Information
  const hotspots = document.querySelectorAll(".hotspot")

  hotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", function () {
      const info = this.getAttribute("data-info")
      showNotification("info", "Area Information", info)
    })
  })

  // Pricing Toggle
  const pricingToggle = document.getElementById("pricing-toggle")
  const monthlyPrices = document.querySelectorAll(".amount.monthly, .period.monthly")
  const annualPrices = document.querySelectorAll(".amount.annual, .period.annual")
  const toggleLabels = document.querySelectorAll(".toggle-label")

  pricingToggle.addEventListener("change", function () {
    if (this.checked) {
      monthlyPrices.forEach((price) => price.classList.add("hidden"))
      annualPrices.forEach((price) => price.classList.remove("hidden"))
      toggleLabels[0].classList.remove("active")
      toggleLabels[1].classList.add("active")
    } else {
      monthlyPrices.forEach((price) => price.classList.remove("hidden"))
      annualPrices.forEach((price) => price.classList.add("hidden"))
      toggleLabels[0].classList.add("active")
      toggleLabels[1].classList.remove("active")
    }
  })

  // Schedule Filter
  const filterBtns = document.querySelectorAll(".filter-btn")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-day")

      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Filter schedule (to be implemented with actual data)
      console.log(`Filtering schedule for: ${filter}`)

      // For demo purposes, show a notification
      if (filter === "all") {
        showNotification("info", "Schedule", "Showing all classes")
      } else {
        showNotification("info", "Schedule", `Showing classes for ${filter}`)
      }
    })
  })

  // Schedule View Toggle
  const viewBtns = document.querySelectorAll(".view-btn")
  const tableView = document.querySelector(".schedule-table-view")
  const calendarView = document.querySelector(".schedule-calendar-view")

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const view = this.getAttribute("data-view")

      // Update active button
      viewBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Update active view
      if (view === "table") {
        tableView.classList.add("active")
        calendarView.classList.remove("active")
      } else {
        tableView.classList.remove("active")
        calendarView.classList.add("active")
      }
    })
  })

  // Calendar Navigation
  const prevWeekBtn = document.getElementById("prev-week")
  const nextWeekBtn = document.getElementById("next-week")
  const calendarTitle = document.getElementById("calendar-title")

  let currentWeek = 0

  prevWeekBtn.addEventListener("click", () => {
    currentWeek--
    updateCalendar()
  })

  nextWeekBtn.addEventListener("click", () => {
    currentWeek++
    updateCalendar()
  })

  function updateCalendar() {
    if (currentWeek === 0) {
      calendarTitle.textContent = "This Week"
    } else if (currentWeek === 1) {
      calendarTitle.textContent = "Next Week"
    } else if (currentWeek === -1) {
      calendarTitle.textContent = "Last Week"
    } else if (currentWeek > 0) {
      calendarTitle.textContent = `${currentWeek} Weeks Ahead`
    } else {
      calendarTitle.textContent = `${Math.abs(currentWeek)} Weeks Ago`
    }

    // Here you would update the calendar grid with actual data
    // For demo purposes, show a notification
    showNotification("info", "Calendar", `Viewing ${calendarTitle.textContent}`)
  }

  // BMI Calculator
  const calculateBmiBtn = document.getElementById("calculate-bmi")
  const heightInput = document.getElementById("height")
  const weightInput = document.getElementById("weight")
  const bmiValue = document.getElementById("bmi-value")
  const bmiCategory = document.getElementById("bmi-category")

  calculateBmiBtn.addEventListener("click", () => {
    const height = Number.parseFloat(heightInput.value)
    const weight = Number.parseFloat(weightInput.value)

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      showNotification("error", "Error", "Please enter valid height and weight values")
      return
    }

    // BMI formula: weight (kg) / (height (m))^2
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    const roundedBmi = bmi.toFixed(1)

    bmiValue.textContent = roundedBmi

    // Determine BMI category
    let category
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
      category = "Obesity"
      bmiCategory.style.color = "#e74c3c"
    }

    bmiCategory.textContent = category
  })

  // Heart Rate Zones Calculator
  const calculateHrBtn = document.getElementById("calculate-hr")
  const ageInput = document.getElementById("age")
  const hrZones = document.getElementById("hr-zones")

  calculateHrBtn.addEventListener("click", () => {
    const age = Number.parseInt(ageInput.value)

    if (isNaN(age) || age <= 0) {
      showNotification("error", "Error", "Please enter a valid age")
      return
    }

    // Calculate maximum heart rate (220 - age)
    const maxHr = 220 - age

    // Calculate heart rate zones
    const zone1 = [Math.round(maxHr * 0.5), Math.round(maxHr * 0.6)]
    const zone2 = [Math.round(maxHr * 0.6), Math.round(maxHr * 0.7)]
    const zone3 = [Math.round(maxHr * 0.7), Math.round(maxHr * 0.8)]
    const zone4 = [Math.round(maxHr * 0.8), Math.round(maxHr * 0.9)]
    const zone5 = [Math.round(maxHr * 0.9), maxHr]

    // Display heart rate zones
    hrZones.innerHTML = `
            <div class="hr-zone zone-1">
                <span>Zone 1 (Very Light): ${zone1[0]} - ${zone1[1]} bpm</span>
                <span>50-60%</span>
            </div>
            <div class="hr-zone zone-2">
                <span>Zone 2 (Light): ${zone2[0]} - ${zone2[1]} bpm</span>
                <span>60-70%</span>
            </div>
            <div class="hr-zone zone-3">
                <span>Zone 3 (Moderate): ${zone3[0]} - ${zone3[1]} bpm</span>
                <span>70-80%</span>
            </div>
            <div class="hr-zone zone-4">
                <span>Zone 4 (Hard): ${zone4[0]} - ${zone4[1]} bpm</span>
                <span>80-90%</span>
            </div>
            <div class="hr-zone zone-5">
                <span>Zone 5 (Maximum): ${zone5[0]} - ${zone5[1]} bpm</span>
                <span>90-100%</span>
            </div>
        `
  })

  // Calorie Calculator
  const calculateCaloriesBtn = document.getElementById("calculate-calories")
  const calWeightInput = document.getElementById("cal-weight")
  const workoutDurationInput = document.getElementById("workout-duration")
  const workoutTypeSelect = document.getElementById("workout-type")
  const caloriesBurned = document.getElementById("calories-burned")

  calculateCaloriesBtn.addEventListener("click", () => {
    const weight = Number.parseFloat(calWeightInput.value)
    const duration = Number.parseInt(workoutDurationInput.value)
    const workoutType = workoutTypeSelect.value

    if (isNaN(weight) || isNaN(duration) || weight <= 0 || duration <= 0) {
      showNotification("error", "Error", "Please enter valid weight and duration values")
      return
    }

    // MET values for different workout types
    const metValues = {
      cardio: 8,
      strength: 6,
      yoga: 3,
      hiit: 10,
    }

    // Calorie formula: MET * weight (kg) * duration (hours)
    const met = metValues[workoutType]
    const durationInHours = duration / 60
    const calories = Math.round(met * weight * durationInHours)

    caloriesBurned.textContent = calories
  })

  // Testimonial Slider
  const testimonialTrack = document.getElementById("testimonial-track")
  const prevTestimonialBtn = document.getElementById("prev-testimonial")
  const nextTestimonialBtn = document.getElementById("next-testimonial")
  const testimonialIndicators = document.getElementById("testimonial-indicators")

  // Sample testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Member for 2 years",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      rating: 5,
      content:
        "FitLife Gym has completely transformed my fitness journey. The trainers are exceptional, the facilities are top-notch, and the community is so supportive. I've lost 30 pounds and gained so much confidence!",
      date: "2 weeks ago",
    },
    {
      name: "Michael Chen",
      role: "Member for 1 year",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      rating: 4,
      content:
        "I've been to many gyms before, but FitLife stands out with its personalized approach and friendly atmosphere. The trainers really care about your progress and the equipment is always well-maintained.",
      date: "1 month ago",
    },
    {
      name: "Emily Rodriguez",
      role: "Member for 3 years",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      rating: 5,
      content:
        "The variety of classes at FitLife keeps me motivated and excited to work out. From HIIT to yoga, there's something for everyone. I've made great friends here and achieved fitness goals I never thought possible!",
      date: "3 weeks ago",
    },
  ]

  // Initialize testimonials
  let currentTestimonial = 0

  function initTestimonials() {
    // Create testimonial cards
    testimonials.forEach((testimonial, index) => {
      const testimonialCard = document.createElement("div")
      testimonialCard.className = "testimonial-card"

      // Create rating stars
      let stars = ""
      for (let i = 0; i < 5; i++) {
        if (i < testimonial.rating) {
          stars += '<i class="fas fa-star"></i>'
        } else {
          stars += '<i class="far fa-star"></i>'
        }
      }

      testimonialCard.innerHTML = `
                <div class="testimonial-header">
                    <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-avatar">
                    <div class="testimonial-info">
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.role}</p>
                        <div class="testimonial-rating">
                            ${stars}
                        </div>
                    </div>
                </div>
                <div class="testimonial-content">
                    "${testimonial.content}"
                </div>
                <div class="testimonial-meta">
                    <span>${testimonial.date}</span>
                </div>
            `

      testimonialTrack.appendChild(testimonialCard)

      // Create indicator
      const indicator = document.createElement("div")
      indicator.className = "indicator"
      if (index === 0) {
        indicator.classList.add("active")
      }
      indicator.addEventListener("click", () => {
        goToTestimonial(index)
      })
      testimonialIndicators.appendChild(indicator)
    })

    updateTestimonialSlider()
  }

  function updateTestimonialSlider() {
    const translateX = -currentTestimonial * 100
    testimonialTrack.style.transform = `translateX(${translateX}%)`

    // Update indicators
    const indicators = testimonialIndicators.querySelectorAll(".indicator")
    indicators.forEach((indicator, index) => {
      if (index === currentTestimonial) {
        indicator.classList.add("active")
      } else {
        indicator.classList.remove("active")
      }
    })
  }

  function goToTestimonial(index) {
    currentTestimonial = index
    updateTestimonialSlider()
  }

  function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length
    updateTestimonialSlider()
  }

  function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length
    updateTestimonialSlider()
  }

  prevTestimonialBtn.addEventListener("click", prevTestimonial)
  nextTestimonialBtn.addEventListener("click", nextTestimonial)

  // Initialize testimonials
  initTestimonials()

  // Auto-advance testimonials every 5 seconds
  setInterval(nextTestimonial, 5000)

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form")

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const firstName = document.getElementById("first-name").value
    const lastName = document.getElementById("last-name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    // Validate form (basic validation)
    if (!firstName || !lastName || !email || !subject || !message) {
      showNotification("error", "Error", "Please fill in all required fields")
      return
    }

    // In a real application, you would send this data to a server
    console.log("Form submitted:", { firstName, lastName, email, phone, subject, message })

    // Show success notification
    showNotification("success", "Success", "Your message has been sent! We'll get back to you soon.")

    // Reset form
    contactForm.reset()
  })

  // Schedule Data
  const scheduleData = [
    {
      time: "06:00 AM",
      class: "Morning Yoga",
      trainer: "Sarah Chen",
      duration: "60 min",
      difficulty: "Beginner",
      spots: 15,
      available: 8,
      day: "monday",
    },
    {
      time: "07:30 AM",
      class: "HIIT Circuit",
      trainer: "Marcus Williams",
      duration: "45 min",
      difficulty: "Intermediate",
      spots: 12,
      available: 3,
      day: "monday",
    },
    {
      time: "09:00 AM",
      class: "Spin Class",
      trainer: "Emily Rodriguez",
      duration: "45 min",
      difficulty: "Intermediate",
      spots: 20,
      available: 5,
      day: "monday",
    },
    {
      time: "05:30 PM",
      class: "Strength Training",
      trainer: "Alex Johnson",
      duration: "60 min",
      difficulty: "Advanced",
      spots: 15,
      available: 0,
      day: "monday",
    },
    {
      time: "07:00 AM",
      class: "Pilates",
      trainer: "Sarah Chen",
      duration: "60 min",
      difficulty: "Beginner",
      spots: 15,
      available: 10,
      day: "tuesday",
    },
    {
      time: "08:30 AM",
      class: "CrossFit",
      trainer: "Marcus Williams",
      duration: "60 min",
      difficulty: "Advanced",
      spots: 12,
      available: 2,
      day: "tuesday",
    },
    {
      time: "06:00 PM",
      class: "Zumba",
      trainer: "Emily Rodriguez",
      duration: "45 min",
      difficulty: "Beginner",
      spots: 25,
      available: 15,
      day: "tuesday",
    },
    {
      time: "06:30 AM",
      class: "Boot Camp",
      trainer: "Marcus Williams",
      duration: "45 min",
      difficulty: "Intermediate",
      spots: 15,
      available: 7,
      day: "wednesday",
    },
    {
      time: "09:30 AM",
      class: "Senior Fitness",
      trainer: "Sarah Chen",
      duration: "60 min",
      difficulty: "Beginner",
      spots: 15,
      available: 9,
      day: "wednesday",
    },
    {
      time: "05:00 PM",
      class: "Boxing",
      trainer: "Alex Johnson",
      duration: "60 min",
      difficulty: "Intermediate",
      spots: 12,
      available: 4,
      day: "wednesday",
    },
    {
      time: "07:30 PM",
      class: "Meditation",
      trainer: "Sarah Chen",
      duration: "30 min",
      difficulty: "Beginner",
      spots: 20,
      available: 12,
      day: "wednesday",
    },
  ]

  // Populate Schedule Table
  function populateScheduleTable(filter = "all") {
    const scheduleBody = document.getElementById("schedule-body")
    scheduleBody.innerHTML = ""

    const filteredSchedule = filter === "all" ? scheduleData : scheduleData.filter((item) => item.day === filter)

    filteredSchedule.forEach((item) => {
      const row = document.createElement("tr")

      // Determine spots class
      let spotsClass = "spots-available"
      let spotsText = `${item.available}/${item.spots}`

      if (item.available === 0) {
        spotsClass = "spots-full"
        spotsText = "Full"
      } else if (item.available <= 3) {
        spotsClass = "spots-limited"
      }

      // Determine difficulty class
      const difficultyClass = `difficulty-${item.difficulty.toLowerCase()}`

      row.innerHTML = `
                <td>${item.time}</td>
                <td>${item.class}</td>
                <td>${item.trainer}</td>
                <td>${item.duration}</td>
                <td><span class="difficulty-badge ${difficultyClass}">${item.difficulty}</span></td>
                <td><span class="${spotsClass}">${spotsText}</span></td>
                <td>
                    <button class="btn btn-primary book-class-btn" ${item.available === 0 ? "disabled" : ""}>
                        ${item.available === 0 ? "Full" : "Book"}
                    </button>
                </td>
            `

      scheduleBody.appendChild(row)
    })

    // Add event listeners to book buttons
    const bookButtons = document.querySelectorAll(".book-class-btn")
    bookButtons.forEach((button) => {
      if (!button.disabled) {
        button.addEventListener("click", function () {
          const row = this.closest("tr")
          const className = row.cells[1].textContent
          const time = row.cells[0].textContent
          const trainer = row.cells[2].textContent

          showNotification(
            "success",
            "Class Booked",
            `You've successfully booked ${className} with ${trainer} at ${time}`,
          )
        })
      }
    })
  }

  // Initialize schedule table
  populateScheduleTable()

  // Update schedule when filter changes
  const scheduleFilterBtns = document.querySelectorAll(".schedule-filters .filter-btn")
  scheduleFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-day")
      populateScheduleTable(filter)
    })
  })

  // Modal Functionality
  const modals = document.querySelectorAll(".modal")
  const modalCloseBtns = document.querySelectorAll(".close-modal")

  // Open modal function
  function openModal(modalId) {
    const modal = document.getElementById(modalId)
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Close modal function
  function closeModal(modalId) {
    const modal = document.getElementById(modalId)
    modal.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Close all modals function
  function closeAllModals() {
    modals.forEach((modal) => {
      modal.classList.remove("active")
    })
    document.body.style.overflow = ""
  }

  // Close modal when clicking close button
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      modal.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  })

  // Auth Modal Tabs
  const authTabs = document.querySelectorAll(".auth-tabs .tab-btn")
  const authPanes = document.querySelectorAll(".tab-pane")

  authTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Update active tab
      authTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      // Update active pane
      authPanes.forEach((pane) => {
        pane.classList.remove("active")
        if (pane.id === `${tabId}-tab`) {
          pane.classList.add("active")
        }
      })
    })
  })

  // Login Button
  const loginBtn = document.getElementById("login-btn")

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault()
    openModal("auth-modal")
  })

  // Login Form Submission
  const loginForm = document.getElementById("login-form")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    // Basic validation
    if (!email || !password) {
      showNotification("error", "Error", "Please fill in all fields")
      return
    }

    // In a real application, you would authenticate with a server
    console.log("Login attempt:", { email, password })

    // For demo purposes, simulate successful login
    simulateLogin()
  })

  // Signup Form Submission
  const signupForm = document.getElementById("signup-form")

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const firstName = document.getElementById("signup-first-name").value
    const lastName = document.getElementById("signup-last-name").value
    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value
    const confirmPassword = document.getElementById("signup-confirm-password").value
    const agreeTerms = document.getElementById("agree-terms").checked

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showNotification("error", "Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      showNotification("error", "Error", "Passwords do not match")
      return
    }

    if (!agreeTerms) {
      showNotification("error", "Error", "You must agree to the Terms & Conditions")
      return
    }

    // In a real application, you would register with a server
    console.log("Signup attempt:", { firstName, lastName, email, password })

    // For demo purposes, simulate successful signup and login
    simulateLogin()
  })

  // Simulate Login
  function simulateLogin() {
    // Close auth modal
    closeModal("auth-modal")

    // Show success notification
    showNotification("success", "Success", "You have successfully logged in!")

    // Hide login button
    loginBtn.classList.add("hidden")

    // Show user profile
    const userProfile = document.getElementById("user-profile")
    userProfile.classList.remove("hidden")

    // Update user name (in a real app, this would come from the server)
    const userName = document.getElementById("user-name")
    userName.textContent = "John Doe"

    // Update profile image (in a real app, this would come from the server)
    const profileImg = document.getElementById("profile-img")
    profileImg.src = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  }

  // Logout Button
  const logoutBtn = document.getElementById("logout-btn")

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault()

    // Hide user profile
    const userProfile = document.getElementById("user-profile")
    userProfile.classList.add("hidden")

    // Show login button
    loginBtn.classList.remove("hidden")

    // Show notification
    showNotification("info", "Logged Out", "You have been logged out successfully")
  })

  // Dashboard Link
  const dashboardLink = document.getElementById("dashboard-link")

  dashboardLink.addEventListener("click", (e) => {
    e.preventDefault()
    openModal("dashboard-modal")
    populateDashboard()
  })

  // Populate Dashboard
  function populateDashboard() {
    // For demo purposes, populate with sample data
    document.getElementById("total-workouts").textContent = "24"
    document.getElementById("calories-burned-total").textContent = "12,450"
    document.getElementById("workout-hours").textContent = "32"
    document.getElementById("achievements-earned").textContent = "8"

    // Recent Activity
    const recentActivity = document.getElementById("recent-activity")
    recentActivity.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon workout-icon">
                    <i class="fas fa-dumbbell"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">Completed HIIT Workout</div>
                    <div class="activity-time">Today, 8:30 AM</div>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon booking-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">Booked Yoga Class</div>
                    <div class="activity-time">Yesterday, 6:15 PM</div>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon achievement-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">Earned "10 Workouts" Badge</div>
                    <div class="activity-time">2 days ago</div>
                </div>
            </div>
        `

    // Upcoming Classes
    const upcomingClasses = document.getElementById("upcoming-classes")
    upcomingClasses.innerHTML = `
            <div class="class-item">
                <div class="class-info">
                    <h4>Morning Yoga</h4>
                    <p>with Sarah Chen</p>
                </div>
                <div class="class-time">Tomorrow, 6:00 AM</div>
            </div>
            <div class="class-item">
                <div class="class-info">
                    <h4>HIIT Circuit</h4>
                    <p>with Marcus Williams</p>
                </div>
                <div class="class-time">Thursday, 7:30 AM</div>
            </div>
            <div class="class-item">
                <div class="class-info">
                    <h4>Strength Training</h4>
                    <p>with Alex Johnson</p>
                </div>
                <div class="class-time">Friday, 5:30 PM</div>
            </div>
        `
  }

  // Bookings Link
  const bookingsLink = document.getElementById("bookings-link")

  bookingsLink.addEventListener("click", (e) => {
    e.preventDefault()
    openModal("bookings-modal")
    populateBookings()
  })

  // Populate Bookings
  function populateBookings() {
    // For demo purposes, populate with sample data
    const bookingsList = document.getElementById("bookings-list")
    bookingsList.innerHTML = `
            <div class="booking-item">
                <div class="booking-info">
                    <div class="booking-title">Morning Yoga</div>
                    <div class="booking-details">
                        <div class="booking-detail">
                            <i class="fas fa-calendar"></i>
                            <span>Tomorrow, 6:00 AM</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-user"></i>
                            <span>Sarah Chen</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-clock"></i>
                            <span>60 min</span>
                        </div>
                    </div>
                    <div class="booking-status status-upcoming">Upcoming</div>
                </div>
                <div class="booking-actions">
                    <button class="booking-action-btn btn-cancel">Cancel</button>
                    <button class="booking-action-btn btn-reschedule">Reschedule</button>
                </div>
            </div>
            <div class="booking-item">
                <div class="booking-info">
                    <div class="booking-title">HIIT Circuit</div>
                    <div class="booking-details">
                        <div class="booking-detail">
                            <i class="fas fa-calendar"></i>
                            <span>Thursday, 7:30 AM</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-user"></i>
                            <span>Marcus Williams</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-clock"></i>
                            <span>45 min</span>
                        </div>
                    </div>
                    <div class="booking-status status-upcoming">Upcoming</div>
                </div>
                <div class="booking-actions">
                    <button class="booking-action-btn btn-cancel">Cancel</button>
                    <button class="booking-action-btn btn-reschedule">Reschedule</button>
                </div>
            </div>
            <div class="booking-item">
                <div class="booking-info">
                    <div class="booking-title">Spin Class</div>
                    <div class="booking-details">
                        <div class="booking-detail">
                            <i class="fas fa-calendar"></i>
                            <span>Monday, 9:00 AM</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-user"></i>
                            <span>Emily Rodriguez</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-clock"></i>
                            <span>45 min</span>
                        </div>
                    </div>
                    <div class="booking-status status-completed">Completed</div>
                </div>
                <div class="booking-actions">
                    <button class="booking-action-btn btn-primary">Book Again</button>
                </div>
            </div>
            <div class="booking-item">
                <div class="booking-info">
                    <div class="booking-title">Zumba</div>
                    <div class="booking-details">
                        <div class="booking-detail">
                            <i class="fas fa-calendar"></i>
                            <span>Last Tuesday, 6:00 PM</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-user"></i>
                            <span>Emily Rodriguez</span>
                        </div>
                        <div class="booking-detail">
                            <i class="fas fa-clock"></i>
                            <span>45 min</span>
                        </div>
                    </div>
                    <div class="booking-status status-cancelled">Cancelled</div>
                </div>
                <div class="booking-actions">
                    <button class="booking-action-btn btn-primary">Book Again</button>
                </div>
            </div>
        `

    // Add event listeners to booking action buttons
    const cancelButtons = bookingsList.querySelectorAll(".btn-cancel")
    cancelButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const bookingItem = this.closest(".booking-item")
        const bookingTitle = bookingItem.querySelector(".booking-title").textContent

        // In a real application, you would send a cancellation request to the server

        // Update booking status
        const bookingStatus = bookingItem.querySelector(".booking-status")
        bookingStatus.className = "booking-status status-cancelled"
        bookingStatus.textContent = "Cancelled"

        // Update booking actions
        const bookingActions = bookingItem.querySelector(".booking-actions")
        bookingActions.innerHTML = `
                    <button class="booking-action-btn btn-primary">Book Again</button>
                `

        // Show notification
        showNotification("info", "Booking Cancelled", `Your ${bookingTitle} booking has been cancelled`)
      })
    })
  }

  // Progress Link
  const progressLink = document.getElementById("progress-link")

  progressLink.addEventListener("click", (e) => {
    e.preventDefault()
    openModal("progress-modal")
  })

  // Progress Tracker Tabs
  const progressTabs = document.querySelectorAll(".progress-tabs .tab-btn")
  const progressPanes = document.querySelectorAll(".progress-content .tab-pane")

  progressTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Update active tab
      progressTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      // Update active pane
      progressPanes.forEach((pane) => {
        pane.classList.remove("active")
        if (pane.id === `${tabId}-tab`) {
          pane.classList.add("active")
        }
      })
    })
  })

  // Feature Buttons
  function generateQRCode() {
    openModal("qr-modal")

    // For demo purposes, generate a simple QR code
    const qrCode = document.getElementById("qr-code")
    qrCode.innerHTML = `
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FitLifeGym-UserID-12345" alt="QR Code">
        `
  }

  function openProgressTracker() {
    openModal("progress-modal")
  }

  function openWorkoutPlanner() {
    openModal("workout-planner-modal")
  }

  function openNutritionCalculator() {
    openModal("nutrition-modal")
  }

  function openLiveChat() {
    openModal("chat-modal")
    initChat()
  }

  function openAchievements() {
    openModal("achievements-modal")
    populateAchievements()
  }

  // Make these functions globally available
  window.generateQRCode = generateQRCode
  window.openProgressTracker = openProgressTracker
  window.openWorkoutPlanner = openWorkoutPlanner
  window.openNutritionCalculator = openNutritionCalculator
  window.openLiveChat = openLiveChat
  window.openAchievements = openAchievements
  window.closeAllModals = closeAllModals

  // Initialize Live Chat
  function initChat() {
    const chatMessages = document.getElementById("chat-messages")

    // Clear previous messages
    chatMessages.innerHTML = ""

    // Add welcome message
    addChatMessage("Hello! Welcome to FitLife Gym support. How can I help you today?", "support")
  }

  // Add Chat Message
  function addChatMessage(message, type) {
    const chatMessages = document.getElementById("chat-messages")
    const messageElement = document.createElement("div")
    messageElement.className = `message ${type}-message`

    // Get current time
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    messageElement.innerHTML = `
            ${message}
            <div class="message-time">${timeString}</div>
        `

    chatMessages.appendChild(messageElement)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Send Chat Message
  function sendChatMessage() {
    const chatInput = document.getElementById("chat-input")
    const message = chatInput.value.trim()

    if (message) {
      // Add user message
      addChatMessage(message, "user")

      // Clear input
      chatInput.value = ""

      // Simulate response after a short delay
      setTimeout(() => {
        let response

        // Simple keyword-based responses
        if (message.toLowerCase().includes("membership") || message.toLowerCase().includes("pricing")) {
          response =
            "We offer several membership options starting at $29/month. Would you like me to provide more details about our membership plans?"
        } else if (message.toLowerCase().includes("class") || message.toLowerCase().includes("schedule")) {
          response =
            "We have a variety of classes throughout the week. You can view our full schedule on our website or app. Is there a specific type of class you're interested in?"
        } else if (message.toLowerCase().includes("trainer") || message.toLowerCase().includes("personal training")) {
          response =
            "Our certified personal trainers are available for one-on-one sessions. Would you like me to help you book a consultation with one of our trainers?"
        } else if (message.toLowerCase().includes("hour") || message.toLowerCase().includes("open")) {
          response =
            "Our gym is open 24/7 for Premium and Elite members. Basic members have access from 6AM to 10PM daily."
        } else {
          response =
            "Thank you for your message. One of our team members will get back to you shortly. Is there anything else I can help you with?"
        }

        // Add support response
        addChatMessage(response, "support")
      }, 1000)
    }
  }

  // Make sendChatMessage globally available
  window.sendChatMessage = sendChatMessage

  // Allow sending message with Enter key
  const chatInput = document.getElementById("chat-input")
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendChatMessage()
    }
  })

  // Populate Achievements
  function populateAchievements() {
    // Badges
    const badgesGrid = document.getElementById("badges-grid")
    badgesGrid.innerHTML = `
            <div class="badge-item">
                <div class="badge-icon badge-unlocked">
                    <i class="fas fa-fire"></i>
                </div>
                <div class="badge-name">First Workout</div>
                <div class="badge-description">Completed your first workout</div>
            </div>
            <div class="badge-item">
                <div class="badge-icon badge-unlocked">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="badge-name">Regular</div>
                <div class="badge-description">Worked out 5 days in a row</div>
            </div>
            <div class="badge-item">
                <div class="badge-icon badge-unlocked">
                    <i class="fas fa-dumbbell"></i>
                </div>
                <div class="badge-name">Strength Master</div>
                <div class="badge-description">Completed 10 strength workouts</div>
            </div>
            <div class="badge-item">
                <div class="badge-icon badge-locked">
                    <i class="fas fa-running"></i>
                </div>
                <div class="badge-name">Cardio King</div>
                <div class="badge-description">Burn 5,000 calories in cardio</div>
                <div class="badge-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 60%"></div>
                    </div>
                    <div class="progress-percentage">60%</div>
                </div>
            </div>
            <div class="badge-item">
                <div class="badge-icon badge-locked">
                    <i class="fas fa-medal"></i>
                </div>
                <div class="badge-name">Class Champion</div>
                <div class="badge-description">Attend 20 group classes</div>
                <div class="badge-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 45%"></div>
                    </div>
                    <div class="progress-percentage">45%</div>
                </div>
            </div>
            <div class="badge-item">
                <div class="badge-icon badge-locked">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="badge-name">Fitness Guru</div>
                <div class="badge-description">Complete 50 workouts</div>
                <div class="badge-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 30%"></div>
                    </div>
                    <div class="progress-percentage">30%</div>
                </div>
            </div>
        `

    // Leaderboard
    const leaderboardList = document.getElementById("leaderboard-list")
    leaderboardList.innerHTML = `
            <div class="leaderboard-item">
                <div class="leaderboard-rank rank-1">1</div>
                <div class="leaderboard-user">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="User" class="leaderboard-avatar">
                    <div class="leaderboard-name">Alex Johnson</div>
                </div>
                <div class="leaderboard-points">1,250 pts</div>
            </div>
            <div class="leaderboard-item">
                <div class="leaderboard-rank rank-2">2</div>
                <div class="leaderboard-user">
                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" alt="User" class="leaderboard-avatar">
                    <div class="leaderboard-name">Emily Rodriguez</div>
                </div>
                <div class="leaderboard-points">1,120 pts</div>
            </div>
            <div class="leaderboard-item">
                <div class="leaderboard-rank rank-3">3</div>
                <div class="leaderboard-user">
                    <img src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg" alt="User" class="leaderboard-avatar">
                    <div class="leaderboard-name">Michael Chen</div>
                </div>
                <div class="leaderboard-points">980 pts</div>
            </div>
            <div class="leaderboard-item">
                <div class="leaderboard-rank">4</div>
                <div class="leaderboard-user">
                    <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="User" class="leaderboard-avatar">
                    <div class="leaderboard-name">Sarah Johnson</div>
                </div>
                <div class="leaderboard-points">920 pts</div>
            </div>
            <div class="leaderboard-item">
                <div class="leaderboard-rank">5</div>
                <div class="leaderboard-user">
                    <img src="https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg" alt="User" class="leaderboard-avatar">
                    <div class="leaderboard-name">David Williams</div>
                </div>
                <div class="leaderboard-points">850 pts</div>
            </div>
            <div class="leaderboard-item">
                <div class="leaderboard-rank">8</div>
                <div class="leaderboard-user">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="User" class="leaderboard-avatar">
                    <div class="leaderboard-name">You</div>
                </div>
                <div class="leaderboard-points">720 pts</div>
            </div>
        `

    // Challenges
    const challengesList = document.getElementById("challenges-list")
    challengesList.innerHTML = `
            <div class="challenge-item">
                <div class="challenge-header">
                    <div class="challenge-title">Summer Shred Challenge</div>
                    <div class="challenge-badge">Active</div>
                </div>
                <div class="challenge-description">Complete 20 workouts in 30 days and earn bonus points and exclusive rewards.</div>
                <div class="challenge-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 40%"></div>
                    </div>
                    <div class="progress-percentage">8/20 workouts</div>
                </div>
                <div class="challenge-actions">
                    <button class="btn btn-primary">View Details</button>
                </div>
            </div>
            <div class="challenge-item">
                <div class="challenge-header">
                    <div class="challenge-title">10K Steps Daily</div>
                    <div class="challenge-badge">Active</div>
                </div>
                <div class="challenge-description">Walk 10,000 steps every day for a week to earn the Step Master badge.</div>
                <div class="challenge-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 71%"></div>
                    </div>
                    <div class="progress-percentage">5/7 days</div>
                </div>
                <div class="challenge-actions">
                    <button class="btn btn-primary">View Details</button>
                </div>
            </div>
            <div class="challenge-item">
                <div class="challenge-header">
                    <div class="challenge-title">Yoga Master</div>
                    <div class="challenge-badge">Available</div>
                </div>
                <div class="challenge-description">Attend 10 yoga classes to unlock the Zen Master achievement and special meditation content.</div>
                <div class="challenge-actions">
                    <button class="btn btn-outline">Join Challenge</button>
                </div>
            </div>
        `
  }

  // Achievements Tabs
  const achievementsTabs = document.querySelectorAll(".achievements-tabs .tab-btn")
  const achievementsPanes = document.querySelectorAll(".achievements-content .tab-pane")

  achievementsTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Update active tab
      achievementsTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      // Update active pane
      achievementsPanes.forEach((pane) => {
        pane.classList.remove("active")
        if (pane.id === `${tabId}-tab`) {
          pane.classList.add("active")
        }
      })
    })
  })

  // Workout Planner
  function generateWorkoutPlan() {
    const fitnessLevel = document.getElementById("fitness-level").value
    const workoutGoal = document.getElementById("workout-goal").value
    const workoutDuration = document.getElementById("workout-duration").value

    // Get selected equipment
    const equipmentCheckboxes = document.querySelectorAll('#equipment-preference input[type="checkbox"]:checked')
    const selectedEquipment = Array.from(equipmentCheckboxes).map((cb) => cb.value)

    if (selectedEquipment.length === 0) {
      showNotification("error", "Error", "Please select at least one equipment preference")
      return
    }

    // Generate workout plan based on preferences
    const workoutPlan = generateWorkoutPlanData(fitnessLevel, workoutGoal, workoutDuration, selectedEquipment)

    // Display workout plan
    const workoutPlanResult = document.getElementById("workout-plan-result")
    workoutPlanResult.innerHTML = `
            <div class="plan-header">
                <h3>Your Personalized Workout Plan</h3>
                <p>Based on your ${fitnessLevel} level and ${workoutGoal} goal</p>
            </div>
            <div class="workout-days">
                ${workoutPlan
                  .map(
                    (day) => `
                    <div class="workout-day">
                        <div class="day-header">
                            <div class="day-title">${day.day}</div>
                            <div class="day-focus">${day.focus}</div>
                        </div>
                        <div class="exercises-list">
                            ${day.exercises
                              .map(
                                (exercise) => `
                                <div class="exercise-item">
                                    <div class="exercise-name">${exercise.name}</div>
                                    <div class="exercise-sets">${exercise.sets}</div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    showNotification("success", "Workout Plan Generated", "Your personalized workout plan is ready!")
  }

  // Generate Workout Plan Data
  function generateWorkoutPlanData(level, goal, duration, equipment) {
    // This is a simplified workout plan generator
    // In a real application, this would be much more sophisticated

    const workoutPlans = {
      "weight-loss": {
        beginner: [
          {
            day: "Day 1",
            focus: "Full Body Cardio",
            exercises: [
              { name: "Walking/Jogging", sets: "20 minutes" },
              { name: "Bodyweight Squats", sets: "3 sets x 10 reps" },
              { name: "Push-ups (modified)", sets: "3 sets x 8 reps" },
              { name: "Plank", sets: "3 sets x 20 seconds" },
            ],
          },
          {
            day: "Day 2",
            focus: "Active Recovery",
            exercises: [
              { name: "Light Walking", sets: "15 minutes" },
              { name: "Stretching", sets: "10 minutes" },
              { name: "Yoga Flow", sets: "15 minutes" },
            ],
          },
          {
            day: "Day 3",
            focus: "Strength & Cardio",
            exercises: [
              { name: "Stationary Bike", sets: "15 minutes" },
              { name: "Dumbbell Rows", sets: "3 sets x 10 reps" },
              { name: "Lunges", sets: "3 sets x 8 each leg" },
              { name: "Mountain Climbers", sets: "3 sets x 15 reps" },
            ],
          },
        ],
      },
      "muscle-gain": {
        intermediate: [
          {
            day: "Day 1",
            focus: "Upper Body Strength",
            exercises: [
              { name: "Bench Press", sets: "4 sets x 8-10 reps" },
              { name: "Dumbbell Rows", sets: "4 sets x 8-10 reps" },
              { name: "Shoulder Press", sets: "3 sets x 10-12 reps" },
              { name: "Bicep Curls", sets: "3 sets x 12 reps" },
              { name: "Tricep Dips", sets: "3 sets x 10 reps" },
            ],
          },
          {
            day: "Day 2",
            focus: "Lower Body Strength",
            exercises: [
              { name: "Squats", sets: "4 sets x 8-10 reps" },
              { name: "Deadlifts", sets: "4 sets x 6-8 reps" },
              { name: "Leg Press", sets: "3 sets x 12 reps" },
              { name: "Calf Raises", sets: "3 sets x 15 reps" },
              { name: "Leg Curls", sets: "3 sets x 12 reps" },
            ],
          },
          {
            day: "Day 3",
            focus: "Core & Conditioning",
            exercises: [
              { name: "Plank", sets: "3 sets x 45 seconds" },
              { name: "Russian Twists", sets: "3 sets x 20 reps" },
              { name: "Dead Bug", sets: "3 sets x 10 each side" },
              { name: "HIIT Circuit", sets: "15 minutes" },
            ],
          },
        ],
      },
    }

    // Return a default plan or generate based on preferences
    return workoutPlans[goal]?.[level] || workoutPlans["weight-loss"]["beginner"]
  }

  // Make generateWorkoutPlan globally available
  window.generateWorkoutPlan = generateWorkoutPlan

  // Nutrition Calculator
  function calculateNutrition() {
    const age = Number.parseInt(document.getElementById("nutrition-age").value)
    const gender = document.getElementById("nutrition-gender").value
    const height = Number.parseFloat(document.getElementById("nutrition-height").value)
    const weight = Number.parseFloat(document.getElementById("nutrition-weight").value)
    const activityLevel = document.getElementById("activity-level").value
    const goal = document.getElementById("nutrition-goal").value

    if (isNaN(age) || isNaN(height) || isNaN(weight) || age <= 0 || height <= 0 || weight <= 0) {
      showNotification("error", "Error", "Please fill in all fields with valid values")
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

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[activityLevel]

    // Adjust calories based on goal
    let targetCalories
    switch (goal) {
      case "lose":
        targetCalories = tdee - 500 // 500 calorie deficit for 1 lb/week loss
        break
      case "gain":
        targetCalories = tdee + 500 // 500 calorie surplus for 1 lb/week gain
        break
      default:
        targetCalories = tdee // Maintain weight
    }

    // Calculate macronutrients (example distribution)
    const protein = Math.round((targetCalories * 0.25) / 4) // 25% protein (4 cal/g)
    const carbs = Math.round((targetCalories * 0.45) / 4) // 45% carbs (4 cal/g)
    const fat = Math.round((targetCalories * 0.3) / 9) // 30% fat (9 cal/g)

    // Display results
    const nutritionResults = document.getElementById("nutrition-results")
    nutritionResults.innerHTML = `
            <div class="nutrition-summary">
                <div class="calorie-target">${Math.round(targetCalories)}</div>
                <div class="calorie-label">Daily Calories</div>
                <div class="macro-distribution">
                    <div class="macro">
                        <div class="macro-value protein-value">${protein}g</div>
                        <div class="macro-label">Protein</div>
                    </div>
                    <div class="macro">
                        <div class="macro-value carbs-value">${carbs}g</div>
                        <div class="macro-label">Carbs</div>
                    </div>
                    <div class="macro">
                        <div class="macro-value fat-value">${fat}g</div>
                        <div class="macro-label">Fat</div>
                    </div>
                </div>
            </div>
            <div class="macro-chart">
                <!-- Placeholder for macro chart -->
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
                    Macro Distribution Chart
                </div>
            </div>
            <div class="meal-plan-title">Sample Meal Plan</div>
            <div class="meal-plan">
                <div class="meal">
                    <div class="meal-header">
                        <div class="meal-title">Breakfast</div>
                        <div class="meal-calories">${Math.round(targetCalories * 0.25)} cal</div>
                    </div>
                    <div class="meal-items">
                        <div class="meal-item">
                            <span>Oatmeal with berries</span>
                            <span>250 cal</span>
                        </div>
                        <div class="meal-item">
                            <span>Greek yogurt</span>
                            <span>150 cal</span>
                        </div>
                        <div class="meal-item">
                            <span>Almonds (1 oz)</span>
                            <span>160 cal</span>
                        </div>
                    </div>
                </div>
                <div class="meal">
                    <div class="meal-header">
                        <div class="meal-title">Lunch</div>
                        <div class="meal-calories">${Math.round(targetCalories * 0.35)} cal</div>
                    </div>
                    <div class="meal-items">
                        <div class="meal-item">
                            <span>Grilled chicken breast</span>
                            <span>300 cal</span>
                        </div>
                        <div class="meal-item">
                            <span>Brown rice (1 cup)</span>
                            <span>220 cal</span>
                        </div>
                        <div class="meal-item">
                            <span>Mixed vegetables</span>
                            <span>100 cal</span>
                        </div>
                    </div>
                </div>
                <div class="meal">
                    <div class="meal-header">
                        <div class="meal-title">Dinner</div>
                        <div class="meal-calories">${Math.round(targetCalories * 0.3)} cal</div>
                    </div>
                    <div class="meal-items">
                        <div class="meal-item">
                            <span>Salmon fillet</span>
                            <span>350 cal</span>
                        </div>
                        <div class="meal-item">
                            <span>Sweet potato</span>
                            <span>180 cal</span>
                        </div>
                        <div class="meal-item">
                            <span>Green salad</span>
                            <span>80 cal</span>
                        </div>
                    </div>
                </div>
                <div class="meal">
                    <div class="meal-header">
                        <div class="meal-title">Snacks</div>
                        <div class="meal-calories">${Math.round(targetCalories * 0.1)} cal</div>
                    </div>
                    <div class="meal-items">
                        <div class="meal-item">
                            <span>Apple with peanut butter</span>
                            <span>200 cal</span>
                        </div>
                    </div>
                </div>
            </div>
        `

    showNotification("success", "Nutrition Plan Generated", "Your personalized nutrition plan is ready!")
  }

  // Make calculateNutrition globally available
  window.calculateNutrition = calculateNutrition

  // Update Body Metrics
  function updateBodyMetrics() {
    const weight = document.getElementById("current-weight").value
    const bodyFat = document.getElementById("body-fat").value

    if (!weight || !bodyFat) {
      showNotification("error", "Error", "Please fill in all fields")
      return
    }

    // In a real application, you would save this data to a server
    console.log("Body metrics updated:", { weight, bodyFat })

    showNotification("success", "Metrics Updated", "Your body metrics have been updated successfully")
  }

  // Add New Goal
  function addNewGoal() {
    const goalTitle = prompt("Enter your fitness goal:")

    if (goalTitle) {
      const goalsList = document.getElementById("goals-list")

      const goalItem = document.createElement("div")
      goalItem.className = "goal-item"
      goalItem.innerHTML = `
                <div class="goal-info">
                    <div class="goal-title">${goalTitle}</div>
                    <div class="goal-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: 0%"></div>
                        </div>
                        <div class="progress-percentage">0%</div>
                    </div>
                </div>
            `

      goalsList.appendChild(goalItem)

      showNotification("success", "Goal Added", `Your goal "${goalTitle}" has been added`)
    }
  }

  // Make these functions globally available
  window.updateBodyMetrics = updateBodyMetrics
  window.addNewGoal = addNewGoal

  // Trainer Booking
  const bookTrainerBtns = document.querySelectorAll(".book-trainer")

  bookTrainerBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const trainerName = this.getAttribute("data-trainer")
      showNotification(
        "success",
        "Booking Request",
        `Your booking request for ${trainerName} has been sent. We'll contact you soon to confirm the session.`,
      )
    })
  })

  // View Trainer Schedule
  const viewScheduleBtns = document.querySelectorAll(".view-schedule")

  viewScheduleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const trainerName = this.getAttribute("data-trainer")
      showNotification(
        "info",
        "Schedule",
        `Viewing schedule for ${trainerName}. This would open a detailed schedule view.`,
      )
    })
  })

  // Membership Plan Selection
  const selectPlanBtns = document.querySelectorAll(".select-plan")

  selectPlanBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const planName = this.getAttribute("data-plan")
      showNotification("success", "Plan Selected", `You've selected the ${planName} plan. Redirecting to checkout...`)
    })
  })

  // Join Now Button
  const joinNowBtn = document.getElementById("join-now-btn")

  joinNowBtn.addEventListener("click", () => {
    document.getElementById("membership").scrollIntoView({ behavior: "smooth" })
  })

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle")

  darkModeToggle.addEventListener("click", function () {
    document.body.setAttribute("data-theme", document.body.getAttribute("data-theme") === "dark" ? "light" : "dark")

    // Update icon
    const icon = this.querySelector("i")
    if (document.body.getAttribute("data-theme") === "dark") {
      icon.className = "fas fa-sun"
    } else {
      icon.className = "fas fa-moon"
    }

    // Save preference
    localStorage.setItem("theme", document.body.getAttribute("data-theme"))
  })

  // Load saved theme
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme)
    const icon = darkModeToggle.querySelector("i")
    if (savedTheme === "dark") {
      icon.className = "fas fa-sun"
    } else {
      icon.className = "fas fa-moon"
    }
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById("back-to-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible")
    } else {
      backToTopBtn.classList.remove("visible")
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  // Notification System
  function showNotification(type, title, message) {
    const notificationContainer = document.getElementById("notification-container")

    const notification = document.createElement("div")
    notification.className = "notification"

    notification.innerHTML = `
            <div class="notification-icon notification-${type}">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-close">&times;</div>
        `

    notificationContainer.appendChild(notification)

    // Add close functionality
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      notification.remove()
    })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "check"
      case "error":
        return "times"
      case "warning":
        return "exclamation-triangle"
      case "info":
        return "info-circle"
      default:
        return "info-circle"
    }
  }

  // Make showNotification globally available
  window.showNotification = showNotification

  // Legal Modal Functions
  function openLegalModal(type) {
    const modalId = type === "privacy" ? "privacy-modal" : "terms-modal"
    openModal(modalId)
  }

  function closeLegalModal(type) {
    const modalId = type === "privacy" ? "privacy-modal" : "terms-modal"
    closeModal(modalId)
  }

  // Make legal modal functions globally available
  window.openLegalModal = openLegalModal
  window.closeLegalModal = closeLegalModal

  // Social Login Handlers
  const googleLoginBtns = document.querySelectorAll("#google-login, #google-signup")
  const githubLoginBtns = document.querySelectorAll("#github-login, #github-signup")

  googleLoginBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showNotification("info", "Google Login", "Google authentication would be implemented here")
    })
  })

  githubLoginBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showNotification("info", "GitHub Login", "GitHub authentication would be implemented here")
    })
  })

  // QR Code Actions
  function downloadQRCode() {
    showNotification("success", "Download", "QR code downloaded successfully")
  }

  function shareQRCode() {
    if (navigator.share) {
      navigator.share({
        title: "My FitLife Gym QR Code",
        text: "Check out my gym membership QR code",
        url: window.location.href,
      })
    } else {
      showNotification("info", "Share", "Share functionality would be implemented here")
    }
  }

  // Make QR functions globally available
  window.downloadQRCode = downloadQRCode
  window.shareQRCode = shareQRCode

  // Initialize tooltips and other interactive elements
  initializeInteractiveElements()

  function initializeInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll(".feature-card, .trainer-card, .pricing-card, .tool-card")

    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px)"
      })

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)"
      })
    })

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(".btn")

    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span")
        const rect = this.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        ripple.style.width = ripple.style.height = size + "px"
        ripple.style.left = x + "px"
        ripple.style.top = y + "px"
        ripple.classList.add("ripple")

        this.appendChild(ripple)

        setTimeout(() => {
          ripple.remove()
        }, 600)
      })
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Lazy loading for images
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        observer.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))

  // Performance monitoring
  window.addEventListener("load", () => {
    // Log performance metrics
    const perfData = performance.getEntriesByType("navigation")[0]
    console.log("Page Load Time:", perfData.loadEventEnd - perfData.loadEventStart, "ms")

    // Show welcome notification after page loads
    setTimeout(() => {
      showNotification(
        "success",
        "Welcome to FitLife!",
        "Your fitness journey starts here. Explore our features and join our community.",
      )
    }, 2000)
  })

  // Error handling for failed image loads
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG") {
        e.target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
      }
    },
    true,
  )

  // Keyboard navigation support
  document.addEventListener("keydown", (e) => {
    // Close modals with Escape key
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal.active")
      if (activeModal) {
        activeModal.classList.remove("active")
        document.body.style.overflow = ""
      }
    }

    // Navigate testimonials with arrow keys
    if (e.key === "ArrowLeft") {
      prevTestimonial()
    } else if (e.key === "ArrowRight") {
      nextTestimonial()
    }
  })

  // Service Worker registration for PWA functionality
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful")
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed")
        })
    })
  }

  // Analytics tracking (placeholder)
  function trackEvent(category, action, label) {
    // In a real application, you would send this to your analytics service
    console.log("Analytics Event:", { category, action, label })
  }

  // Track button clicks
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
      trackEvent("Button", "Click", e.target.textContent.trim())
    }
  })

  // Initialize all components
  console.log("FitLife Gym website initialized successfully!")
})
