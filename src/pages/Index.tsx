import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ── CHATBOT DATA ──────────────────────────────────────────────
const BOT_SCRIPT: Record<string, { text: string; options?: { label: string; next: string }[] }> = {
  start: {
    text: "Привет! Я помощник QA-Agency. Готов ответить на твои вопросы 👋",
    options: [
      { label: "Сколько можно заработать?", next: "earn" },
      { label: "Как начать работу?", next: "start_work" },
      { label: "Нужен ли опыт?", next: "experience" },
      { label: "Это законно?", next: "legal" },
    ],
  },
  earn: {
    text: "В среднем тестировщики зарабатывают 3 000–15 000 ₽/мес. Первое задание — стажировка, за него ты получаешь welcome-бонус от банка. Дальше идут платные задания.",
    options: [{ label: "Как начать?", next: "start_work" }, { label: "Назад", next: "start" }],
  },
  start_work: {
    text: "Просто напиши нашему куратору Лизе в Telegram — она пришлёт ТЗ и пригласит в систему. Это занимает 5 минут.",
    options: [{ label: "Нужен ли опыт?", next: "experience" }, { label: "Назад", next: "start" }],
  },
  experience: {
    text: "Нет, опыт не нужен. Всё, что требуется — быть старше 14 лет и иметь немного свободного времени. Куратор объяснит каждый шаг.",
    options: [{ label: "Это законно?", next: "legal" }, { label: "Назад", next: "start" }],
  },
  legal: {
    text: "Да, это официальная практика контроля качества. Банки регулярно нанимают независимых тестировщиков — это стандартный инструмент проверки сервиса.",
    options: [{ label: "Как начать?", next: "start_work" }, { label: "Назад", next: "start" }],
  },
};

interface ChatMessage {
  from: "bot" | "user";
  text: string;
}

export default function Index() {
  const [tasks, setTasks] = useState(5);
  // Экспоненциальный рост: 800₽ за 1 задание → ~45 000₽ за 30
  const calcEarn = (n: number) => Math.round(800 * Math.pow(n, 1.85) / 10) * 10;
  const totalEarn = calcEarn(tasks);
  const earnPerTask = Math.round(totalEarn / tasks);

  const [form, setForm] = useState({ name: "", age: "", city: "" });
  const [formSent, setFormSent] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatNode, setChatNode] = useState("start");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: BOT_SCRIPT.start.text },
  ]);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleOption = (label: string, next: string) => {
    setMessages((m) => [...m, { from: "user", text: label }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setChatNode(next);
      setMessages((m) => [...m, { from: "bot", text: BOT_SCRIPT[next].text }]);
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.age && form.city) setFormSent(true);
  };

  const sliderProgress = ((tasks - 1) / 29) * 100;

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 grid-lines pointer-events-none z-0" />

      {/* ── HEADER ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(8,13,20,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: "0 0 14px rgba(59,130,246,0.5)",
            }}
          >
            <Icon name="ShieldCheck" size={15} className="text-white" />
          </div>
          <span className="font-golos text-white text-lg" style={{ fontWeight: 800 }}>
            QA<span className="neon-text">-Agency</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-qa px-3 py-1 rounded-full hidden sm:block">
            Официальный набор 2026
          </span>
          <a href="#apply" className="neon-btn px-4 py-2 rounded-xl text-sm text-white font-golos font-bold">
            Пройти отбор
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="badge-qa inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-up">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Набор открыт · Строго 14+
          </div>

          <h1
            className="section-title text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-6 animate-fade-up delay-100"
          >
            Стань тайным покупателем
            <br />
            <span className="neon-text">банковских сервисов</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up delay-200 font-ibm">
            QA-Agency проводит набор тестировщиков молодёжных продуктов от ТОП-банков РФ.
            Проверяй работу курьеров, тестируй приложения и получай за это официальные бонусы.{" "}
            <span className="text-slate-300">Свободный график, без опыта.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up delay-300">
            <a
              href="#apply"
              className="neon-btn px-8 py-4 rounded-2xl text-lg text-white flex items-center gap-3 animate-pulse-neon"
            >
              <Icon name="Send" size={20} className="text-white" />
              Пройти отбор в Telegram
            </a>
            <a
              href="#how"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-ibm"
            >
              Как это работает
              <Icon name="ChevronDown" size={16} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-16 animate-fade-up delay-400">
            {[
              { val: "14+", label: "Возраст участия" },
              { val: "50+", label: "Банков-партнёров" },
              { val: "3 000₽", label: "Средний бонус" },
            ].map((s) => (
              <div key={s.val} className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-golos font-black neon-text mb-1">{s.val}</div>
                <div className="text-xs text-slate-500 font-ibm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float opacity-40">
          <Icon name="ChevronDown" size={24} className="text-blue-400" />
        </div>
      </section>

      {/* ── WHY YOU ── */}
      <section id="why" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-qa inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
              <Icon name="Target" size={12} className="text-blue-400" />О нас
            </div>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Почему именно <span className="neon-text">ты?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
              >
                <Icon name="Building2" size={22} className="text-blue-400" />
              </div>
              <p className="text-slate-300 leading-relaxed font-ibm">
                Банки активно выпускают карты для аудитории{" "}
                <strong className="text-white">14–18 лет</strong>, но взрослый человек не может
                протестировать такой продукт.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
              >
                <Icon name="ClipboardCheck" size={22} className="text-blue-400" />
              </div>
              <p className="text-slate-300 leading-relaxed font-ibm">
                Мы — независимое агентство контроля качества (QA). Наша задача: проверять, как банки
                обслуживают молодёжь в регионах.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 md:col-span-2">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <Icon name="Users" size={22} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-golos font-bold text-lg mb-2">
                    Нам нужны реальные отзывы от реальных людей
                  </h3>
                  <p className="text-slate-400 font-ibm leading-relaxed">
                    Только живой участник аудитории 14+ может дать честную оценку продукту. Твой опыт
                    буквально влияет на то, как банки улучшают свои сервисы.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-qa inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
              <Icon name="Workflow" size={12} className="text-blue-400" />
              Процесс
            </div>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Как проходит <span className="neon-text">работа</span>
            </h2>
            <p className="text-slate-500 font-ibm">4 простых шага — от заявки до оплаты</p>
          </div>

          <div className="space-y-4">
            {[
              {
                n: "01",
                icon: "FileText",
                title: "Получение ТЗ",
                text: "Связываешься с куратором, получаешь техническое задание и уникальную ссылку для регистрации в системе банка-партнёра.",
              },
              {
                n: "02",
                icon: "PackageOpen",
                title: "Встреча курьера",
                text: "Получаешь бесплатную карту, оцениваешь скорость доставки, вежливость и компетентность сотрудника банка.",
              },
              {
                n: "03",
                icon: "CreditCard",
                title: "Тест активации",
                text: "Совершаешь любую минимальную покупку (сок или жвачка), чтобы проверить работоспособность чипа и приложения.",
              },
              {
                n: "04",
                icon: "Banknote",
                title: "Отчёт и оплата",
                text: "Сдаёшь короткий отзыв куратору. Забираешь приветственный денежный бонус от самого банка за участие в тесте и получаешь доступ к приватным заданиям.",
              },
            ].map((step) => (
              <div key={step.n} className="glass-card rounded-2xl p-6 flex items-start gap-5">
                <div className="step-number">{step.n}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(59,130,246,0.1)" }}
                    >
                      <Icon name={step.icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-blue-400" />
                    </div>
                    <h3 className="text-white font-golos font-bold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 font-ibm leading-relaxed text-sm">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <section id="calculator" className="relative z-10 py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-qa inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
              <Icon name="Calculator" size={12} className="text-blue-400" />
              Калькулятор
            </div>
            <h2 className="section-title text-3xl sm:text-4xl text-white mb-4">
              Посчитай свой <span className="neon-text">заработок</span>
            </h2>
            <p className="text-slate-500 font-ibm text-sm">Передвигай ползунок и смотри потенциальный доход</p>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <div
              className="text-center mb-10 p-6 rounded-2xl"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}
            >
              <div className="text-slate-500 font-ibm text-sm mb-2">Потенциальный доход в месяц</div>
              <div
                className="font-golos font-black text-5xl sm:text-6xl neon-text mb-2"
                style={{ filter: "drop-shadow(0 0 20px rgba(59,130,246,0.5))" }}
              >
                {totalEarn.toLocaleString("ru-RU")} ₽
              </div>
              <div className="text-slate-500 font-ibm text-xs">
                {tasks}{" "}
                {tasks === 1 ? "задание" : tasks < 5 ? "задания" : "заданий"} × ~{earnPerTask.toLocaleString("ru-RU")} ₽ за задание
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 font-ibm text-sm">Заданий в месяц</span>
                <span className="font-golos font-bold text-white text-xl">{tasks}</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={tasks}
                onChange={(e) => setTasks(Number(e.target.value))}
                className="slider-track"
                style={{ "--progress": `${sliderProgress}%` } as React.CSSProperties}
              />
              <div className="flex justify-between mt-2">
                <span className="text-slate-600 font-ibm text-xs">1</span>
                <span className="text-slate-600 font-ibm text-xs">30</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: "Clock", label: "Свободный график" },
                { icon: "MapPin", label: "Любой регион" },
                { icon: "TrendingUp", label: "Рост дохода" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Icon
                    name={item.icon as Parameters<typeof Icon>[0]["name"]}
                    size={18}
                    className="text-blue-400 mx-auto mb-2"
                  />
                  <div className="text-slate-500 font-ibm text-xs">{item.label}</div>
                </div>
              ))}
            </div>

            <a
              href="#apply"
              className="neon-btn w-full py-4 rounded-2xl text-white text-center block font-golos font-bold text-base"
            >
              Хочу зарабатывать {totalEarn.toLocaleString("ru-RU")} ₽
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-qa inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
              <Icon name="HelpCircle" size={12} className="text-blue-400" />
              Вопросы
            </div>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Важные условия <span className="neon-text">стажировки</span>
            </h2>
          </div>

          <div className="space-y-4">
            <FaqItem
              q="Нужно ли за что-то платить?"
              a="Нет. Никаких вложений. Карты партнёров полностью бесплатны в обслуживании."
              icon="ShieldOff"
            />
            <FaqItem
              q="Как происходит оплата за первый тест?"
              a="Первое задание — это стажировка и проверка на ответственность. Мы не платим за него из своего бюджета, чтобы отсеять недобросовестных кандидатов. Но за оформление тестовой карты ты гарантированно получаешь денежный welcome-бонус (кэшбэк) от самого банка."
              icon="Banknote"
            />
            <FaqItem
              q="Что будет после первого задания?"
              a="Кандидаты, успешно сдавшие первый отчёт, попадают в закрытый пул тестировщиков с доступом к платным заданиям и карьерному росту (поиск новых кандидатов)."
              icon="Star"
            />
          </div>
        </div>
      </section>

      {/* ── PRE-QUAL FORM ── */}
      <section id="apply" className="relative z-10 py-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-qa inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
              <Icon name="UserCheck" size={12} className="text-blue-400" />
              Предквалификация
            </div>
            <h2 className="section-title text-3xl sm:text-4xl text-white mb-4">
              Пройди быстрый <span className="neon-text">отбор</span>
            </h2>
            <p className="text-slate-500 font-ibm text-sm">
              30 секунд — и куратор свяжется с тобой в течение часа
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8">
            {formSent ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    boxShadow: "0 0 24px rgba(59,130,246,0.2)",
                  }}
                >
                  <Icon name="CheckCircle" size={32} className="text-blue-400" />
                </div>
                <h3 className="text-white font-golos font-bold text-2xl mb-3">Заявка принята!</h3>
                <p className="text-slate-400 font-ibm text-sm leading-relaxed">
                  Куратор Лиза свяжется с тобой в Telegram в течение часа. Проверь свои сообщения.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-400 font-ibm text-sm mb-2">Имя</label>
                  <input
                    type="text"
                    placeholder="Как тебя зовут?"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-ibm text-sm mb-2">Возраст</label>
                  <input
                    type="number"
                    placeholder="Сколько тебе лет?"
                    value={form.age}
                    min={14}
                    max={25}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-ibm text-sm mb-2">Город</label>
                  <input
                    type="text"
                    placeholder="В каком городе ты живёшь?"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="neon-btn w-full py-4 rounded-2xl text-white font-golos font-bold text-base mt-2"
                >
                  Отправить заявку
                </button>
                <p className="text-slate-600 font-ibm text-xs text-center">
                  Нажимая кнопку, ты соглашаешься с обработкой персональных данных
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="relative z-10 py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="section-title text-4xl sm:text-5xl text-white mb-6 leading-[1.1]">
            Готов начать
            <br />
            <span className="neon-text">первый тест?</span>
          </h2>
          <p className="text-slate-400 font-ibm text-lg mb-10 leading-relaxed">
            Места в твоём городе могут быть ограничены. Напиши нашему куратору Лизе прямо сейчас,
            чтобы забрать ТЗ.
          </p>
          <a
            href="https://t.me/lizonkaz"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white text-xl font-golos font-bold animate-pulse-neon"
          >
            <Icon name="Send" size={22} className="text-white" />
            Написать куратору Лизе
          </a>
          <div className="mt-8 flex items-center justify-center gap-6 text-slate-600 text-sm font-ibm">
            <span className="flex items-center gap-1.5">
              <Icon name="Lock" size={13} />
              Бесплатно
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="Clock" size={13} />
              Ответ за 1 час
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="Shield" size={13} />
              Официально
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 border-t py-8 px-6"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
            >
              <Icon name="ShieldCheck" size={12} className="text-white" />
            </div>
            <span className="font-golos font-bold text-white text-sm">QA-Agency</span>
          </div>
          <p className="text-slate-600 font-ibm text-xs text-center">
            © 2026 QA-Agency · Независимое агентство контроля качества · Только 14+
          </p>
          <div className="badge-qa px-3 py-1 rounded-full text-xs">Официальный набор</div>
        </div>
      </footer>

      {/* ── CHATBOT ── */}
      <>
        {chatOpen && (
          <div className="fixed bottom-24 right-5 sm:right-8 z-50 w-80 sm:w-96 animate-chat-open">
            <div
              className="chatbot-bubble overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(59,130,246,0.15), 0 20px 60px rgba(0,0,0,0.5)" }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(59,130,246,0.08)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                      boxShadow: "0 0 12px rgba(59,130,246,0.4)",
                    }}
                  >
                    <Icon name="Bot" size={17} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-golos font-bold text-sm">Помощник QA</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs font-ibm">Онлайн</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>

              <div className="h-64 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "none" }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={msg.from === "bot" ? "chatbot-msg-bot" : "chatbot-msg-user"}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="chatbot-msg-bot flex items-center gap-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="w-2 h-2 rounded-full bg-blue-400 inline-block"
                          style={{
                            animation: `typingDot 1.2s ease-in-out ${d * 0.2}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {!typing && BOT_SCRIPT[chatNode]?.options && (
                <div
                  className="px-4 pb-4 space-y-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}
                >
                  {BOT_SCRIPT[chatNode].options!.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleOption(opt.label, opt.next)}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-slate-300 font-ibm text-sm transition-all duration-200 hover:text-white"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "rgba(59,130,246,0.35)";
                        el.style.background = "rgba(59,130,246,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "rgba(255,255,255,0.08)";
                        el.style.background = "rgba(255,255,255,0.04)";
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            const opening = !chatOpen;
            setChatOpen(opening);
            if (opening) {
              setChatNode("start");
              setMessages([{ from: "bot", text: BOT_SCRIPT.start.text }]);
            }
          }}
          className="fixed bottom-6 right-5 sm:right-8 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            boxShadow: chatOpen
              ? "0 0 30px rgba(59,130,246,0.5)"
              : "0 0 20px rgba(59,130,246,0.35), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={22} className="text-white" />
          {!chatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#080d14]" />
          )}
        </button>
      </>
    </div>
  );
}

function FaqItem({ q, a, icon }: { q: string; a: string; icon: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <Icon name={icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-blue-400" />
        </div>
        <span className="text-white font-golos font-semibold flex-1 text-base">{q}</span>
        <Icon
          name={open ? "ChevronUp" : "ChevronDown"}
          size={18}
          className="text-slate-500 flex-shrink-0 transition-transform duration-200"
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pl-[76px]">
          <p className="text-slate-400 font-ibm text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}