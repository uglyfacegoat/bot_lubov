import type {
  Achievement,
  ActivityLog,
  ActivityQuest,
  DailyTask,
  DailyLog,
  NutritionDay,
  Reward,
  TreatSlot,
  UserProfile,
  WeeklyReport,
  WeightLog,
} from "@/types";

export const profile: UserProfile = {
  id: "couple-01",
  name: "Любимая",
  role: "participant",
  systemDay: 8,
  level: 3,
  xp: 360,
  xpToNextLevel: 520,
  stars: 820,
  weeklyProgressPercent: 78,
  isAdmin: true,
};

export const dailyLogs: DailyLog[] = [
  { date: "2026-04-27", waterLiters: 2.1, waterGoalLiters: 2.5, steps: 5400, activityGoal: 6500, nutritionInPlan: true, mood: "good" },
  { date: "2026-04-28", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 7200, activityGoal: 6500, nutritionInPlan: true, mood: "calm" },
  { date: "2026-04-29", waterLiters: 1.7, waterGoalLiters: 2.5, steps: 6100, activityGoal: 6500, nutritionInPlan: false, mood: "tired", unplannedFood: true, returnedToPlan: true },
  { date: "2026-04-30", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 7600, activityGoal: 6500, nutritionInPlan: true, mood: "inspired" },
  { date: "2026-05-01", waterLiters: 2.0, waterGoalLiters: 2.5, steps: 6900, activityGoal: 6500, nutritionInPlan: true, mood: "good" },
  { date: "2026-05-02", waterLiters: 2.6, waterGoalLiters: 2.5, steps: 8200, activityGoal: 6500, nutritionInPlan: true, mood: "calm" },
  { date: "2026-05-03", waterLiters: 2.2, waterGoalLiters: 2.5, steps: 5800, activityGoal: 6500, nutritionInPlan: true, mood: "heavy" },
  { date: "2026-05-04", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 7100, activityGoal: 6500, nutritionInPlan: true, mood: "good" },
  { date: "2026-05-05", waterLiters: 1.8, waterGoalLiters: 2.5, steps: 6200, activityGoal: 6500, nutritionInPlan: true, mood: "tired" },
  { date: "2026-05-06", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 8000, activityGoal: 6500, nutritionInPlan: true, mood: "inspired" },
  { date: "2026-05-07", waterLiters: 2.0, waterGoalLiters: 2.5, steps: 6400, activityGoal: 6500, nutritionInPlan: false, mood: "calm", unplannedFood: true, returnedToPlan: true },
  { date: "2026-05-08", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 7800, activityGoal: 6500, nutritionInPlan: true, mood: "good" },
  { date: "2026-05-09", waterLiters: 2.6, waterGoalLiters: 2.5, steps: 9100, activityGoal: 6500, nutritionInPlan: true, mood: "inspired" },
  { date: "2026-05-10", waterLiters: 2.1, waterGoalLiters: 2.5, steps: 6000, activityGoal: 6500, nutritionInPlan: true, mood: "calm" },
  { date: "2026-05-11", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 7350, activityGoal: 6500, nutritionInPlan: true, mood: "good" },
  { date: "2026-05-12", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 8100, activityGoal: 6500, nutritionInPlan: true, mood: "inspired" },
  { date: "2026-05-13", waterLiters: 2.0, waterGoalLiters: 2.5, steps: 6200, activityGoal: 6500, nutritionInPlan: true, mood: "tired" },
  { date: "2026-05-14", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 7700, activityGoal: 6500, nutritionInPlan: true, mood: "calm" },
  { date: "2026-05-15", waterLiters: 1.6, waterGoalLiters: 2.5, steps: 5500, activityGoal: 6500, nutritionInPlan: false, mood: "heavy", unplannedFood: true, returnedToPlan: true },
  { date: "2026-05-16", waterLiters: 2.6, waterGoalLiters: 2.5, steps: 8500, activityGoal: 6500, nutritionInPlan: true, mood: "good" },
  { date: "2026-05-17", waterLiters: 2.0, waterGoalLiters: 2.5, steps: 6900, activityGoal: 6500, caloriesBurned: 2140, nutritionInPlan: true, mood: "calm" },
  { date: "2026-05-18", waterLiters: 1.6, waterGoalLiters: 2.5, steps: 6200, activityGoal: 6500, caloriesBurned: 2070, nutritionInPlan: true, mood: "good" },
  { date: "2026-05-19", waterLiters: 2.0, waterGoalLiters: 2.5, steps: 7800, activityGoal: 6500, caloriesBurned: 2220, nutritionInPlan: true, mood: "inspired" },
  { date: "2026-05-20", waterLiters: 2.5, waterGoalLiters: 2.5, steps: 7100, activityGoal: 6500, caloriesBurned: 2160, nutritionInPlan: true, mood: "calm" },
  { date: "2026-05-21", waterLiters: 2.1, waterGoalLiters: 2.5, steps: 6500, activityGoal: 6500, caloriesBurned: 2110, nutritionInPlan: false, mood: "tired", unplannedFood: true, returnedToPlan: true },
  { date: "2026-05-22", waterLiters: 1.7, waterGoalLiters: 2.5, steps: 6200, activityGoal: 6500, caloriesBurned: 2060, nutritionInPlan: true, mood: "good" },
  { date: "2026-05-23", waterLiters: 1.1, waterGoalLiters: 2.5, steps: 6200, activityGoal: 6500, caloriesBurned: 2050, nutritionInPlan: true, mood: "calm" },
];

export const nutritionDays: NutritionDay[] = [
  {
    date: "2026-05-17",
    calorieGoal: 1850,
    proteinGoal: 105,
    fatGoal: 62,
    carbsGoal: 205,
    meals: [{ id: "d17", meal: "dinner", name: "День в плане", amount: "суммарно", calories: 1760, protein: 98, fat: 58, carbs: 196 }],
  },
  {
    date: "2026-05-18",
    calorieGoal: 1850,
    proteinGoal: 105,
    fatGoal: 62,
    carbsGoal: 205,
    meals: [{ id: "d18", meal: "dinner", name: "День в плане", amount: "суммарно", calories: 1680, protein: 102, fat: 54, carbs: 181 }],
  },
  {
    date: "2026-05-19",
    calorieGoal: 1850,
    proteinGoal: 105,
    fatGoal: 62,
    carbsGoal: 205,
    meals: [{ id: "d19", meal: "dinner", name: "День в плане", amount: "суммарно", calories: 1810, protein: 108, fat: 61, carbs: 202 }],
  },
  {
    date: "2026-05-20",
    calorieGoal: 1850,
    proteinGoal: 105,
    fatGoal: 62,
    carbsGoal: 205,
    meals: [{ id: "d20", meal: "dinner", name: "День в плане", amount: "суммарно", calories: 1740, protein: 101, fat: 55, carbs: 194 }],
  },
  {
    date: "2026-05-21",
    calorieGoal: 1850,
    proteinGoal: 105,
    fatGoal: 62,
    carbsGoal: 205,
    meals: [{ id: "d21", meal: "dinner", name: "Внеплановая еда отмечена", amount: "суммарно", calories: 2040, protein: 92, fat: 78, carbs: 232 }],
  },
  {
    date: "2026-05-22",
    calorieGoal: 1850,
    proteinGoal: 105,
    fatGoal: 62,
    carbsGoal: 205,
    meals: [{ id: "d22", meal: "dinner", name: "День в плане", amount: "суммарно", calories: 1710, protein: 100, fat: 56, carbs: 188 }],
  },
  {
    date: "2026-05-23",
    calorieGoal: 1850,
    proteinGoal: 105,
    fatGoal: 62,
    carbsGoal: 205,
    meals: [
      { id: "m1", meal: "breakfast", name: "Греческий йогурт, ягоды, гранола", amount: "280 г", calories: 360, protein: 28, fat: 9, carbs: 42 },
      { id: "m2", meal: "lunch", name: "Курица, рис, салат", amount: "1 порция", calories: 520, protein: 42, fat: 14, carbs: 58 },
      { id: "m3", meal: "snack", name: "Капучино и банан", amount: "1 набор", calories: 210, protein: 6, fat: 6, carbs: 34 },
      { id: "m4", meal: "dinner", name: "Рыба, картофель, овощи", amount: "1 порция", calories: 430, protein: 34, fat: 13, carbs: 42 },
    ],
  },
];

export const weightLogs: WeightLog[] = [
  { date: "2026-04-27", weightKg: 72.4, note: "Стартовая точка недели" },
  { date: "2026-05-04", weightKg: 72.1, note: "Спокойная неделя" },
  { date: "2026-05-11", weightKg: 71.8, note: "Больше воды и прогулок" },
  { date: "2026-05-18", weightKg: 71.6, note: "Данные, не оценка" },
];

export const activityLogs: ActivityLog[] = dailyLogs.map((day, index) => ({
  date: day.date,
  steps: day.steps,
  walkMinutes: day.steps > 7000 ? 42 : 28,
  workoutDone: index % 5 === 1,
  stretchDone: index % 3 === 0,
}));

export const quests: ActivityQuest[] = [
  { id: "steps", title: "Шаги дня", description: "Мягкая цель 6 500 шагов", points: 25, done: false },
  { id: "walk", title: "Прогулка", description: "20 минут без спешки", points: 25, done: false },
  { id: "stretch", title: "Растяжка", description: "Короткий вечерний reset", points: 15, done: true },
  { id: "training", title: "Тренировка", description: "Только как забота о теле", points: 25, done: false },
];

export const treatSlot: TreatSlot = {
  id: "weekly-treat",
  status: "locked",
  availableAt: "2026-05-26",
  daysUntilAvailable: 3,
};

export const rewards: Reward[] = [
  { id: "movie", title: "Выбрать фильм", price: 150, description: "Вечер без споров по жанру", purchasedCount: 0 },
  { id: "coffee", title: "Кофе или напиток", price: 250, description: "Любимый напиток в красивом месте", purchasedCount: 0 },
  { id: "flowers", title: "Цветы", price: 400, description: "Букет без повода", purchasedCount: 1 },
  { id: "date", title: "Свидание", price: 500, description: "Планируем вечер только для нас", purchasedCount: 0 },
  { id: "cosmetics-2k", title: "Косметика до 2000 рублей", price: 700, description: "Выбор без отмены после покупки", purchasedCount: 0 },
  { id: "restaurant-slot", title: "Ресторан как вкусный слот", price: 1000, description: "Праздничный слот внутри плана", purchasedCount: 0 },
  { id: "cosmetics-5k", title: "Косметика до 5000 рублей", price: 1500, description: "Большая приятная покупка", purchasedCount: 0 },
  { id: "salon", title: "Салон, ногти, уход", price: 2000, description: "День заботы и восстановления", purchasedCount: 0 },
  { id: "shopping", title: "Шопинг день", price: 3000, description: "Выбор вещей в спокойном темпе", purchasedCount: 0 },
  { id: "gift-trip", title: "Большой подарок или мини поездка", price: 5000, description: "Главная награда сезона", purchasedCount: 0 },
  { id: "home-spa", title: "Домашний spa-вечер", price: 350, description: "Маска, свечи, спокойный вечер", purchasedCount: 0 },
  { id: "breakfast", title: "Завтрак в городе", price: 650, description: "Красивое утро без спешки", purchasedCount: 0 },
  { id: "book", title: "Книга или ежедневник", price: 800, description: "Что-то приятное для себя", purchasedCount: 0 },
  { id: "perfume", title: "Духи или аромат", price: 2200, description: "Выбрать аромат настроения", purchasedCount: 0 },
  { id: "photo-day", title: "Фото-день", price: 2600, description: "Прогулка и красивые кадры", purchasedCount: 0 },
  { id: "massage", title: "Массаж", price: 3500, description: "Восстановление вместо давления", purchasedCount: 0 },
  { id: "weekend-hotel", title: "Ночь в отеле", price: 6500, description: "Мини-перезагрузка для двоих", purchasedCount: 0 },
];

export const dailyTasks: DailyTask[] = [
  {
    id: "plank-video",
    title: "Видео планки",
    description: "Записать короткое видео. Не как экзамен, а как отметку силы.",
    category: "proof",
    options: [
      { id: "1m", label: "1 минута", points: 15 },
      { id: "2m", label: "2 минуты", points: 25 },
      { id: "3m", label: "3 минуты", points: 40 },
    ],
    selectedOptionId: "1m",
    completed: false,
  },
  {
    id: "walk",
    title: "Прогулка",
    description: "Спокойно пройтись без цели наказать себя.",
    category: "movement",
    options: [
      { id: "20", label: "20 минут", points: 15 },
      { id: "40", label: "40 минут", points: 25 },
      { id: "60", label: "60 минут", points: 35 },
    ],
    selectedOptionId: "20",
    completed: false,
  },
  {
    id: "water",
    title: "Вода в ритме",
    description: "Добрать воду маленькими шагами.",
    category: "water",
    options: [
      { id: "05", label: "+0.5 л", points: 10 },
      { id: "1", label: "+1 л", points: 18 },
      { id: "goal", label: "закрыть цель", points: 25 },
    ],
    selectedOptionId: "05",
    completed: false,
  },
  {
    id: "food-photo",
    title: "Фото еды",
    description: "Сфоткать прием пищи для честной отметки.",
    category: "food",
    options: [
      { id: "one", label: "1 прием", points: 8 },
      { id: "two", label: "2 приема", points: 14 },
      { id: "all", label: "весь день", points: 25 },
    ],
    selectedOptionId: "one",
    completed: false,
  },
  {
    id: "stretch",
    title: "Растяжка вечером",
    description: "Разгрузить тело и спокойно закончить день.",
    category: "recovery",
    options: [
      { id: "5", label: "5 минут", points: 8 },
      { id: "10", label: "10 минут", points: 15 },
      { id: "20", label: "20 минут", points: 25 },
    ],
    selectedOptionId: "10",
    completed: false,
  },
];

export const achievements: Achievement[] = [
  { id: "honesty", title: "Честность", description: "Отметки без стыда и наказаний", unlocked: true },
  { id: "water", title: "Вода в ритме", description: "5 дней близко к цели", unlocked: true },
  { id: "return", title: "Возвращение", description: "Вернуться в план после сложного дня", unlocked: true },
];

export const weeklyReports: WeeklyReport[] = [
  { week: 1, startDate: "2026-04-27", stabilityPercent: 72, waterAverage: 2.1, activityAverage: 6742, note: "Старт без жесткости" },
  { week: 2, startDate: "2026-05-04", stabilityPercent: 78, waterAverage: 2.2, activityAverage: 7214, note: "Больше прогулок" },
  { week: 3, startDate: "2026-05-11", stabilityPercent: 81, waterAverage: 2.2, activityAverage: 7079, note: "Стабильность растет" },
  { week: 4, startDate: "2026-05-18", stabilityPercent: 78, waterAverage: 1.9, activityAverage: 6700, note: "Нормальная живая неделя" },
];
