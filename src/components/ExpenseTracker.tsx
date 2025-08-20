import React, { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Calendar as CalendarComponent } from "./ui/calendar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LabelList,
} from "recharts";
import {
  PlusIcon,
  Search,
  Filter,
  Trash2,
  Edit3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  X,
  BarChart3,
  List,
  Check,
  Calendar,
  CalendarDays,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other",
];

const categoryColors = {
  "Food & Dining": "#FF7A59", // chart-1
  Transportation: "#7B61FF", // chart-2
  Shopping: "#FFD7A8", // chart-3
  Entertainment: "#9FEDFE", // chart-4
  "Bills & Utilities": "#FF9AA2", // chart-5
  Healthcare: "#FF7A59", // primary
  Travel: "#7B61FF", // accent
  Education: "#E2E8F0", // secondary
  Other: "#F8FAFC", // muted
};

const categoryColorClasses = {
  "Food & Dining": "bg-chart-1",
  Transportation: "bg-chart-2",
  Shopping: "bg-chart-3",
  Entertainment: "bg-chart-4",
  "Bills & Utilities": "bg-chart-5",
  Healthcare: "bg-primary",
  Travel: "bg-accent",
  Education: "bg-secondary",
  Other: "bg-muted",
};

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      title: "Grocery Shopping",
      amount: 85.5,
      category: "Food & Dining",
      date: "2025-08-15",
      description: "Weekly grocery shopping",
    },
    {
      id: "2",
      title: "Gas Station",
      amount: 45.0,
      category: "Transportation",
      date: "2025-08-14",
      description: "Fuel for car",
    },
    {
      id: "3",
      title: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      date: "2025-08-13",
      description: "Monthly subscription",
    },
    {
      id: "4",
      title: "Coffee Shop",
      amount: 8.75,
      category: "Food & Dining",
      date: "2025-08-12",
      description: "Morning coffee",
    },
    {
      id: "5",
      title: "Phone Bill",
      amount: 65.0,
      category: "Bills & Utilities",
      date: "2025-08-11",
      description: "Monthly phone bill",
    },
    {
      id: "6",
      title: "Uber Ride",
      amount: 18.5,
      category: "Transportation",
      date: "2025-08-10",
      description: "Trip to downtown",
    },
    {
      id: "7",
      title: "Movie Tickets",
      amount: 24.0,
      category: "Entertainment",
      date: "2025-08-09",
      description: "Date night",
    },
    {
      id: "8",
      title: "New Shoes",
      amount: 120.0,
      category: "Shopping",
      date: "2025-08-08",
      description: "Running shoes",
    },
    // Adding some older expenses for better analytics
    {
      id: "9",
      title: "Rent Payment",
      amount: 1200.0,
      category: "Bills & Utilities",
      date: "2025-07-01",
      description: "Monthly rent",
    },
    {
      id: "10",
      title: "Grocery Shopping",
      amount: 95.0,
      category: "Food & Dining",
      date: "2025-07-15",
      description: "Monthly groceries",
    },
    {
      id: "11",
      title: "Vacation Flight",
      amount: 450.0,
      category: "Travel",
      date: "2025-06-20",
      description: "Summer vacation",
    },
    {
      id: "12",
      title: "Doctor Visit",
      amount: 120.0,
      category: "Healthcare",
      date: "2025-05-15",
      description: "Annual checkup",
    },
    {
      id: "13",
      title: "New Laptop",
      amount: 899.0,
      category: "Shopping",
      date: "2025-03-10",
      description: "Work laptop",
    },
    {
      id: "14",
      title: "Online Course",
      amount: 79.99,
      category: "Education",
      date: "2025-02-05",
      description: "Programming course",
    },
    {
      id: "15",
      title: "Car Insurance",
      amount: 150.0,
      category: "Bills & Utilities",
      date: "2025-01-15",
      description: "6-month premium",
    },
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Analytics specific filters - now supports multiple categories
  const [
    analyticsSelectedCategories,
    setAnalyticsSelectedCategories,
  ] = useState<string[]>([]);
  const [showAnalyticsFilters, setShowAnalyticsFilters] =
    useState(false);

  // Analytics time filters
  const [analyticsSelectedMonth, setAnalyticsSelectedMonth] =
    useState<string>("all");
  const [analyticsSelectedYear, setAnalyticsSelectedYear] =
    useState<string>("all");
  const [activeQuickFilter, setActiveQuickFilter] = useState<
    string | null
  >(null);

  // History modal state
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryMonth, setSelectedHistoryMonth] =
    useState<string>(() => {
      const now = new Date();
      const lastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
      );
      return `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1).toString().padStart(2, "0")}`;
    });

  const [formData, setFormData] = useState(() => {
    const today = new Date();
    const todayLocalString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    return {
      title: "",
      amount: "",
      category: "",
      date: todayLocalString,
      description: "",
    };
  });

  // Calendar modal state
  const [showCalendarModal, setShowCalendarModal] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<
    Date | undefined
  >(() => {
    // Initialize with current local date to avoid timezone issues
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
  });

  // Current month expenses (for main view) - moved up to be available for filteredExpenses
  const currentMonthExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return currentMonthExpenses.filter((expense) => {
      const matchesSearch =
        expense.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        expense.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" ||
        expense.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [currentMonthExpenses, searchTerm, filterCategory]);

  // Analytics filtered expenses - now handles multiple categories and time filters
  const analyticsFilteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Category filter
      const matchesCategory =
        analyticsSelectedCategories.length === 0
          ? true
          : analyticsSelectedCategories.includes(
              expense.category,
            );

      // Special handling for last 6 months quick filter
      if (activeQuickFilter === "last6Months") {
        const now = new Date();
        const sixMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
        );
        const expenseDate = new Date(expense.date);
        return (
          matchesCategory &&
          expenseDate >= sixMonthsAgo &&
          expenseDate <= now
        );
      }

      // Regular month and year filters
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth() + 1; // getMonth() is 0-indexed
      const matchesMonth =
        analyticsSelectedMonth === "all"
          ? true
          : parseInt(analyticsSelectedMonth) === expenseMonth;

      // Year filter
      const expenseYear = expenseDate.getFullYear();
      const matchesYear =
        analyticsSelectedYear === "all"
          ? true
          : parseInt(analyticsSelectedYear) === expenseYear;

      return matchesCategory && matchesMonth && matchesYear;
    });
  }, [
    expenses,
    analyticsSelectedCategories,
    analyticsSelectedMonth,
    analyticsSelectedYear,
    activeQuickFilter,
  ]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
  }, [expenses]);

  // Analytics totals based on filtered data
  const analyticsFilteredTotal = useMemo(() => {
    return analyticsFilteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
  }, [analyticsFilteredExpenses]);

  const monthlyExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  // Historical expenses organized by month
  const historicalExpensesByMonth = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const historicalExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return !(
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const groupedByMonth = historicalExpenses.reduce(
      (acc, expense) => {
        const expenseDate = new Date(expense.date);
        const monthKey = `${expenseDate.getFullYear()}-${(expenseDate.getMonth() + 1).toString().padStart(2, "0")}`;

        if (!acc[monthKey]) {
          acc[monthKey] = [];
        }
        acc[monthKey].push(expense);

        return acc;
      },
      {} as Record<string, Expense[]>,
    );

    // Sort months in descending order
    const sortedMonths = Object.keys(groupedByMonth).sort(
      (a, b) => b.localeCompare(a),
    );

    return { groupedByMonth, sortedMonths };
  }, [expenses]);

  // Get expenses for selected history month
  const selectedMonthHistoryExpenses = useMemo(() => {
    return (
      historicalExpensesByMonth.groupedByMonth[
        selectedHistoryMonth
      ] || []
    );
  }, [historicalExpensesByMonth, selectedHistoryMonth]);

  // Calculate total for selected history month
  const selectedMonthTotal = useMemo(() => {
    return selectedMonthHistoryExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
  }, [selectedMonthHistoryExpenses]);

  // New analytics calculations
  const lastMonthExpenses = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
    );
    const lastMonthYear = lastMonth.getFullYear();
    const lastMonthNumber = lastMonth.getMonth();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === lastMonthNumber &&
          expenseDate.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const last6MonthsExpenses = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 6,
    );

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= sixMonthsAgo && expenseDate <= now
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const currentYearExpenses = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    const totals = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] =
          (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );
    return Object.entries(totals).sort(([, a], [, b]) => b - a);
  }, [expenses]);

  // Analytics category totals based on filtered data
  const analyticsCategoryTotals = useMemo(() => {
    const totals = analyticsFilteredExpenses.reduce(
      (acc, expense) => {
        acc[expense.category] =
          (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );
    return Object.entries(totals).sort(([, a], [, b]) => b - a);
  }, [analyticsFilteredExpenses]);

  const pieChartData = useMemo(() => {
    return analyticsCategoryTotals.map(
      ([category, amount]) => ({
        name: category,
        value: amount,
        color:
          categoryColors[
            category as keyof typeof categoryColors
          ],
      }),
    );
  }, [analyticsCategoryTotals]);

  // Helper functions for multi-select
  const toggleCategory = (category: string) => {
    setAnalyticsSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
    setActiveQuickFilter(null); // Clear quick filter when manually changing categories
  };

  const selectAllCategories = () => {
    setAnalyticsSelectedCategories([...categories]);
    setActiveQuickFilter(null); // Clear quick filter when manually changing categories
  };

  const clearAllCategories = () => {
    setAnalyticsSelectedCategories([]);
    setActiveQuickFilter(null); // Clear quick filter when manually changing categories
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.amount ||
      !formData.category
    ) {
      return;
    }

    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description,
    };

    if (editingExpense) {
      setExpenses(
        expenses.map((exp) =>
          exp.id === editingExpense.id ? newExpense : exp,
        ),
      );
      setEditingExpense(null);
    } else {
      setExpenses([newExpense, ...expenses]);
    }

    setFormData({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setShowAddForm(false);
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      description: expense.description || "",
    });
    // Parse date as local date to avoid timezone issues
    const [year, month, day] = expense.date
      .split("-")
      .map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setEditingExpense(expense);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const resetForm = () => {
    const today = new Date();
    const todayLocalString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    setFormData({
      title: "",
      amount: "",
      category: "",
      date: todayLocalString,
      description: "",
    });
    setEditingExpense(null);
    setShowAddForm(false);
    setSelectedDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ),
    );
    setShowCalendarModal(false);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Use local date methods to avoid timezone issues
      const year = date.getFullYear();
      const month = (date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const localDateString = `${year}-${month}-${day}`;

      setFormData({
        ...formData,
        date: localDateString,
      });
      setShowCalendarModal(false);
    }
  };

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        analyticsFilteredTotal > 0
          ? (
              (data.value / analyticsFilteredTotal) *
              100
            ).toFixed(1)
          : "0";
      return (
        <div className="bg-card border-border rounded-lg p-4 shadow-lg">
          <p
            className="text-foreground"
            style={{
              fontFamily: "var(--font-family-primary)",
              fontSize: "16px",
              fontWeight: "var(--font-weight-regular)",
            }}
          >
            {data.payload.name}
          </p>
          <p
            className="text-primary"
            style={{
              fontFamily: "var(--font-family-primary)",
              fontSize: "14px",
              fontWeight: "var(--font-weight-regular)",
            }}
          >
            ${data.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function for pie chart percentages
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    // Only show label if percentage is >= 8% to avoid overcrowding
    if (percent < 0.08) return null;

    const RADIAN = Math.PI / 180;
    const radius =
      innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{
          fontFamily: "var(--font-family-primary)",
          fontSize: "12px",
          fontWeight: "600",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Get display text for selected categories
  const getSelectedCategoriesText = () => {
    if (analyticsSelectedCategories.length === 0) {
      return "All Categories";
    } else if (analyticsSelectedCategories.length === 1) {
      return analyticsSelectedCategories[0];
    } else if (
      analyticsSelectedCategories.length === categories.length
    ) {
      return "All Categories";
    } else {
      return `${analyticsSelectedCategories.length} Categories`;
    }
  };

  // Get available months and years from expenses
  const availableMonths = useMemo(() => {
    const months = new Set<number>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      months.add(date.getMonth() + 1);
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [expenses]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [expenses]);

  // Format month name
  const getMonthName = (monthNumber: number) => {
    const date = new Date(2024, monthNumber - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long" });
  };

  // Get active filters count for display
  const getActiveFiltersCount = () => {
    let count = 0;
    if (
      analyticsSelectedCategories.length > 0 &&
      analyticsSelectedCategories.length < categories.length
    ) {
      count++;
    }
    if (analyticsSelectedMonth !== "all") count++;
    if (analyticsSelectedYear !== "all") count++;
    return count;
  };

  // Clear all analytics filters
  const clearAllAnalyticsFilters = () => {
    setAnalyticsSelectedCategories([]);
    setAnalyticsSelectedMonth("all");
    setAnalyticsSelectedYear("all");
    setActiveQuickFilter(null);
  };

  // Quick filter handlers
  const handleQuickFilter = (filterType: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Clear category filters when using quick filters
    setAnalyticsSelectedCategories([]);

    switch (filterType) {
      case "lastMonth":
        const lastMonth = new Date(
          currentYear,
          currentMonth - 2,
        ); // -2 because we want previous month
        const lastMonthNumber = lastMonth.getMonth() + 1;
        const lastMonthYear = lastMonth.getFullYear();

        setAnalyticsSelectedMonth(lastMonthNumber.toString());
        setAnalyticsSelectedYear(lastMonthYear.toString());
        setActiveQuickFilter("lastMonth");
        break;

      case "last6Months":
        // For last 6 months, we'll clear month filter and keep year, but track it as a special filter
        setAnalyticsSelectedMonth("all");
        setAnalyticsSelectedYear("all"); // Show all data but track as last 6 months filter
        setActiveQuickFilter("last6Months");
        break;

      case "thisYear":
        setAnalyticsSelectedMonth("all");
        setAnalyticsSelectedYear(currentYear.toString());
        setActiveQuickFilter("thisYear");
        break;

      default:
        setAnalyticsSelectedMonth("all");
        setAnalyticsSelectedYear("all");
        setActiveQuickFilter(null);
    }
  };

  // Navigate history months
  const navigateHistoryMonth = (direction: "prev" | "next") => {
    const currentIndex =
      historicalExpensesByMonth.sortedMonths.indexOf(
        selectedHistoryMonth,
      );
    if (direction === "prev" && currentIndex > 0) {
      setSelectedHistoryMonth(
        historicalExpensesByMonth.sortedMonths[
          currentIndex - 1
        ],
      );
    } else if (
      direction === "next" &&
      currentIndex <
        historicalExpensesByMonth.sortedMonths.length - 1
    ) {
      setSelectedHistoryMonth(
        historicalExpensesByMonth.sortedMonths[
          currentIndex + 1
        ],
      );
    }
  };

  // Format month for display
  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Desktop Header */}
      <div className="flex items-center gap-6 mb-8">
        {/* Enhanced App Icon with Multiple Layers */}
        <div className="relative group cursor-pointer">
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 blur-xl group-hover:blur-2xl transition-all duration-500 group-hover:scale-110"></div>

          {/* Main icon container */}
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-orange-400 to-accent flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105 border-2 border-white/20">
            {/* Inner highlight */}
            <div className="absolute inset-1 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>

            {/* Dollar sign with enhanced styling */}
            <DollarSign className="w-10 h-10 text-white drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300" />

            {/* Floating particles effect */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Enhanced Brand Name and Tagline */}
        <div className="flex-1">
          <div className="relative">
            {/* App name with enhanced styling */}
            <h1
              className="text-foreground relative z-10 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{
                fontFamily: "var(--font-family-primary)",
                fontSize: "42px",
                fontWeight: "var(--font-weight-regular)",
                lineHeight: 1.1,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                filter:
                  "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
              }}
            >
              SpendSmart
            </h1>

            {/* Subtle underline accent */}
            <div className="absolute -bottom-1 left-0 h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full opacity-60"></div>
          </div>

          {/* Enhanced tagline */}
          <p
            className="mt-3 relative"
            style={{
              fontFamily: "var(--font-family-primary)",
              fontSize: "19px",
              fontWeight: "var(--font-weight-regular)",
              lineHeight: 1.3,
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "0 1px 3px rgba(0,0,0,0.2)",
              letterSpacing: "0.025em",
            }}
          >
            <span className="relative">
              Master your money, one expense at a time
              {/* Sparkle effects */}
              <span className="absolute -top-1 -right-6 text-white/40 animate-pulse">
                ✨
              </span>
            </span>
          </p>
        </div>

        {/* Quick Stats Section - Fills the empty space */}
        <div className="flex gap-4">
          {/* Today's Expenses */}
          <Card className="bg-card/90 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 rounded-xl p-2 group-hover:bg-primary/30 transition-colors duration-300">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "12px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Today
                </p>
                <p
                  className="text-foreground"
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-family-primary)",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  $
                  {expenses
                    .filter(
                      (expense) =>
                        new Date(
                          expense.date,
                        ).toDateString() ===
                        new Date().toDateString(),
                    )
                    .reduce(
                      (sum, expense) => sum + expense.amount,
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          {/* This Week's Expenses */}
          <Card className="bg-card/90 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-accent/20 rounded-xl p-2 group-hover:bg-accent/30 transition-colors duration-300">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "12px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  This Week
                </p>
                <p
                  className="text-foreground"
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-family-primary)",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  $
                  {(() => {
                    const now = new Date();
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(
                      now.getDate() - now.getDay(),
                    );
                    startOfWeek.setHours(0, 0, 0, 0);

                    return expenses
                      .filter((expense) => {
                        const expenseDate = new Date(
                          expense.date,
                        );
                        return (
                          expenseDate >= startOfWeek &&
                          expenseDate <= now
                        );
                      })
                      .reduce(
                        (sum, expense) => sum + expense.amount,
                        0,
                      )
                      .toFixed(2);
                  })()}
                </p>
              </div>
            </div>
          </Card>

          {/* Average Daily Spending */}
          <Card className="bg-card/90 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/20 rounded-xl p-2 group-hover:bg-chart-3/30 transition-colors duration-300">
                <BarChart3 className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "12px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Daily Avg
                </p>
                <p
                  className="text-foreground"
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-family-primary)",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  $
                  {(() => {
                    const currentMonth = new Date().getMonth();
                    const currentYear =
                      new Date().getFullYear();
                    const daysInMonth = new Date(
                      currentYear,
                      currentMonth + 1,
                      0,
                    ).getDate();
                    const averageDaily =
                      monthlyExpenses / daysInMonth;
                    return averageDaily.toFixed(2);
                  })()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Desktop Tabs with Add Button */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-4">
            <TabsList className="inline-flex bg-card/95 backdrop-blur-sm border border-border/50 rounded-3xl p-2 shadow-lg gap-1">
              <TabsTrigger
                value="overview"
                className="rounded-2xl flex items-center justify-center gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground px-7 py-3 transition-all duration-200 whitespace-nowrap min-w-[140px]"
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--font-family-primary)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                <List className="w-5 h-5" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-2xl flex items-center justify-center gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground px-7 py-3 transition-all duration-200 whitespace-nowrap min-w-[140px]"
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--font-family-primary)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* History Button */}
            {historicalExpensesByMonth.sortedMonths.length >
              0 && (
              <Button
                onClick={() => setShowHistory(true)}
                className="bg-card/95 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card rounded-2xl flex items-center gap-3 px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--font-family-primary)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                <History className="w-5 h-5" />
                History
                <Badge className="bg-primary/20 text-primary border-0">
                  {
                    historicalExpensesByMonth.sortedMonths
                      .length
                  }
                </Badge>
              </Button>
            )}
          </div>

          {/* Enhanced Desktop Add Button - Repositioned */}
          <div className="relative">
            {/* Glowing ring effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-30 blur-lg animate-pulse scale-110"></div>

            <Button
              onClick={() => setShowAddForm(true)}
              className="relative bg-gradient-to-br from-primary via-orange-400 to-accent text-white hover:from-primary/90 hover:via-orange-400/90 hover:to-accent/90 rounded-3xl flex items-center gap-4 px-10 py-5 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl group border-2 border-white/30 backdrop-blur-sm"
              style={{
                fontFamily: "var(--font-family-primary)",
                fontWeight: "var(--font-weight-regular)",
                fontSize: "18px",
                background:
                  "linear-gradient(135deg, rgba(255, 122, 89, 0.95) 0%, rgba(255, 165, 0, 0.9) 50%, rgba(123, 97, 255, 0.95) 100%)",
              }}
            >
              {/* Animated plus icon with enhanced effects */}
              <div className="relative">
                <PlusIcon className="w-7 h-7 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110 drop-shadow-lg" />

                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              Add New Expense
              {/* Enhanced floating particles */}
              <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-200"></div>
              <div className="absolute bottom-2 left-4 w-1 h-1 bg-white/50 rounded-full animate-bounce delay-700"></div>
              <div className="absolute top-1/2 left-2 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-1000"></div>
              {/* Inner highlight gradient */}
              <div className="absolute inset-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              {/* Subtle animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            </Button>

            {/* Success ripple indicator - shows when hovering */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-500 scale-110 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
          </div>
        </div>

        {/* Desktop Overview Tab */}
        <TabsContent
          value="overview"
          className="space-y-8 mt-8"
        >
          {/* Desktop Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-card border-border rounded-2xl p-6 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-muted-foreground mb-2"
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "16px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    Total Expenses This Year
                  </p>
                  <p
                    className="text-foreground"
                    style={{
                      fontSize: "32px",
                      fontFamily: "var(--font-family-primary)",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    ${currentYearExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-muted-foreground mb-2"
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "16px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    This Month
                  </p>
                  <p
                    className="text-foreground"
                    style={{
                      fontSize: "32px",
                      fontFamily: "var(--font-family-primary)",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    ${monthlyExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="bg-accent/10 p-4 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-muted-foreground mb-2"
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "16px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    Total Transactions
                  </p>
                  <p
                    className="text-foreground"
                    style={{
                      fontSize: "32px",
                      fontFamily: "var(--font-family-primary)",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    {expenses.length}
                  </p>
                </div>
                <div className="bg-chart-2/10 p-4 rounded-2xl">
                  <TrendingDown className="w-8 h-8 text-chart-2" />
                </div>
              </div>
            </Card>
          </div>

          {/* Desktop Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Left Column - Category Overview */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card border-border rounded-2xl p-6">
                <h2
                  className="text-foreground mb-6"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "24px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Spending by Category
                </h2>
                <div className="space-y-4">
                  {categoryTotals
                    .slice(0, 6)
                    .map(([category, amount]) => {
                      const maxAmount = Math.max(
                        ...categoryTotals
                          .slice(0, 6)
                          .map(([, amt]) => amt),
                      );
                      const percentage =
                        (amount / maxAmount) * 100;
                      const categoryColor =
                        categoryColors[
                          category as keyof typeof categoryColors
                        ];

                      return (
                        <div
                          key={category}
                          className="relative overflow-hidden rounded-xl border border-border/50 transition-all duration-200 hover:border-border hover:shadow-md cursor-pointer group"
                          style={{
                            background: `linear-gradient(135deg, ${categoryColor}08 0%, ${categoryColor}12 100%)`,
                          }}
                        >
                          {/* Progress bar background */}
                          <div
                            className="absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-300 group-hover:opacity-30"
                            style={{
                              width: `${percentage}%`,
                              background: `linear-gradient(90deg, ${categoryColor}40 0%, ${categoryColor}60 100%)`,
                            }}
                          />

                          {/* Content */}
                          <div className="relative flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-6 h-6 rounded-full shadow-sm border-2 border-white/50"
                                style={{
                                  backgroundColor:
                                    categoryColor,
                                }}
                              />
                              <div>
                                <p
                                  className="text-foreground"
                                  style={{
                                    fontSize: "16px",
                                    fontFamily:
                                      "var(--font-family-primary)",
                                    fontWeight:
                                      "var(--font-weight-regular)",
                                  }}
                                >
                                  {category}
                                </p>
                                <p
                                  className="text-muted-foreground"
                                  style={{
                                    fontSize: "12px",
                                    fontFamily:
                                      "var(--font-family-primary)",
                                    fontWeight:
                                      "var(--font-weight-regular)",
                                  }}
                                >
                                  {(
                                    (amount / totalExpenses) *
                                    100
                                  ).toFixed(1)}
                                  % of total
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p
                                className="text-foreground"
                                style={{
                                  fontSize: "18px",
                                  fontFamily:
                                    "var(--font-family-primary)",
                                  fontWeight:
                                    "var(--font-weight-regular)",
                                }}
                              >
                                ${amount.toFixed(2)}
                              </p>
                              {/* Visual amount indicator */}
                              <div className="flex justify-end mt-2">
                                <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor:
                                        categoryColor,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </div>

            {/* Right Column - Expenses List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filter */}
              <Card className="bg-card border-border rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={(e) =>
                          setSearchTerm(e.target.value)
                        }
                        className="pl-12 bg-input-background border-border text-foreground rounded-xl h-14"
                        style={{
                          fontFamily:
                            "var(--font-family-primary)",
                          fontSize: "16px",
                          fontWeight:
                            "var(--font-weight-regular)",
                        }}
                      />
                    </div>

                    <Button
                      onClick={() =>
                        setShowFilters(!showFilters)
                      }
                      className={`flex items-center gap-2 h-14 px-6 rounded-xl ${
                        filterCategory !== "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      }`}
                      style={{
                        fontSize: "16px",
                        fontFamily:
                          "var(--font-family-primary)",
                        fontWeight:
                          "var(--font-weight-regular)",
                      }}
                    >
                      <Filter className="w-5 h-5" />
                      Filter
                      {filterCategory !== "all" && (
                        <Badge className="bg-background/20 text-current ml-1">
                          1
                        </Badge>
                      )}
                    </Button>

                    {filterCategory !== "all" && (
                      <Button
                        onClick={() => setFilterCategory("all")}
                        className="group relative bg-muted/60 border border-border/50 text-muted-foreground hover:bg-card hover:text-foreground hover:border-border rounded-xl h-14 w-14 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                          Clear filter
                        </div>
                      </Button>
                    )}
                  </div>

                  {showFilters && (
                    <div className="border-t border-border pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <Button
                          onClick={() => {
                            setFilterCategory("all");
                            setShowFilters(false);
                          }}
                          className={`justify-start h-12 rounded-xl ${
                            filterCategory === "all"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          }`}
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "var(--font-family-primary)",
                            fontWeight:
                              "var(--font-weight-regular)",
                          }}
                        >
                          All Categories
                        </Button>
                        {categories.map((category) => (
                          <Button
                            key={category}
                            onClick={() => {
                              setFilterCategory(category);
                              setShowFilters(false);
                            }}
                            className={`justify-start h-12 rounded-xl ${
                              filterCategory === category
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            }`}
                            style={{
                              fontSize: "14px",
                              fontFamily:
                                "var(--font-family-primary)",
                              fontWeight:
                                "var(--font-weight-regular)",
                            }}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${categoryColorClasses[category as keyof typeof categoryColorClasses]}`}
                            ></div>
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Current Month Expenses List */}
              <Card className="bg-card border-border rounded-2xl p-6">
                <h3
                  className="text-foreground mb-6"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "24px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  This Month's Expenses
                </h3>
                <div className="space-y-4">
                  {filteredExpenses.length === 0 ? (
                    <div className="text-center py-12">
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontFamily:
                            "var(--font-family-primary)",
                          fontSize: "18px",
                          fontWeight:
                            "var(--font-weight-regular)",
                        }}
                      >
                        No expenses found
                      </p>
                    </div>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-4 h-4 rounded-full ${categoryColorClasses[expense.category as keyof typeof categoryColorClasses]}`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p
                                className="text-foreground truncate"
                                style={{
                                  fontSize: "16px",
                                  fontFamily:
                                    "var(--font-family-primary)",
                                  fontWeight:
                                    "var(--font-weight-regular)",
                                }}
                              >
                                {expense.title}
                              </p>
                              <Badge
                                variant="secondary"
                                className="bg-secondary/50 text-secondary-foreground rounded-lg"
                                style={{
                                  fontSize: "12px",
                                  fontFamily:
                                    "var(--font-family-primary)",
                                  fontWeight:
                                    "var(--font-weight-regular)",
                                }}
                              >
                                {expense.category}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-muted-foreground">
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontFamily:
                                    "var(--font-family-primary)",
                                  fontWeight:
                                    "var(--font-weight-regular)",
                                }}
                              >
                                {new Date(
                                  expense.date,
                                ).toLocaleDateString()}
                              </p>
                              {expense.description && (
                                <p
                                  className="truncate"
                                  style={{
                                    fontSize: "14px",
                                    fontFamily:
                                      "var(--font-family-primary)",
                                    fontWeight:
                                      "var(--font-weight-regular)",
                                  }}
                                >
                                  {expense.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "20px",
                              fontFamily:
                                "var(--font-family-primary)",
                              fontWeight:
                                "var(--font-weight-regular)",
                            }}
                          >
                            ${expense.amount.toFixed(2)}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleEdit(expense)
                              }
                              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg p-3 h-10 w-10"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleDelete(expense.id)
                              }
                              className="bg-destructive-foreground/10 text-destructive-foreground hover:bg-destructive-foreground/20 rounded-lg p-3 h-10 w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Desktop Analytics Tab */}
        <TabsContent
          value="analytics"
          className="space-y-8 mt-8"
        >
          {/* New Analytics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Last Month Card - Clickable Quick Filter */}
            <Card
              className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 group relative overflow-hidden ${
                activeQuickFilter === "lastMonth"
                  ? "bg-white/95 border-primary/60 shadow-2xl ring-2 ring-primary/30 backdrop-blur-sm glow-primary"
                  : "bg-card border-border hover:border-primary/20 hover:bg-white/98"
              }`}
              style={{
                background:
                  activeQuickFilter === "lastMonth"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,122,89,0.08) 100%)"
                    : undefined,
                boxShadow:
                  activeQuickFilter === "lastMonth"
                    ? "0 8px 32px rgba(255,122,89,0.15), 0 0 0 1px rgba(255,122,89,0.1)"
                    : undefined,
              }}
              onClick={() => handleQuickFilter("lastMonth")}
              style={{
                background:
                  activeQuickFilter === "lastMonth"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,122,89,0.08) 100%)"
                    : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`mb-2 transition-colors duration-300 ${
                      activeQuickFilter === "lastMonth"
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "16px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    Spent Last Month
                    {activeQuickFilter === "lastMonth" && (
                      <span className="ml-2 text-xs bg-primary/90 text-white px-3 py-1 rounded-full shadow-md font-medium">
                        Active
                      </span>
                    )}
                  </p>
                  <p
                    className={`transition-colors duration-300 ${
                      activeQuickFilter === "lastMonth"
                        ? "text-foreground font-medium"
                        : "text-foreground"
                    }`}
                    style={{
                      fontSize: "28px",
                      fontFamily: "var(--font-family-primary)",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    ${lastMonthExpenses.toFixed(2)}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    activeQuickFilter === "lastMonth"
                      ? "bg-primary/30 scale-110 shadow-lg ring-2 ring-primary/20"
                      : "bg-chart-3/10 group-hover:bg-primary/15"
                  }`}
                >
                  <Calendar
                    className={`w-6 h-6 transition-colors duration-300 ${
                      activeQuickFilter === "lastMonth"
                        ? "text-primary"
                        : "text-chart-3"
                    }`}
                  />
                </div>
              </div>
            </Card>

            {/* Last 6 Months Card - Clickable Quick Filter */}
            <Card
              className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 group relative overflow-hidden ${
                activeQuickFilter === "last6Months"
                  ? "bg-white/95 border-primary/60 shadow-2xl ring-2 ring-primary/30 backdrop-blur-sm"
                  : "bg-card border-border hover:border-primary/20 hover:bg-white/98"
              }`}
              style={{
                background:
                  activeQuickFilter === "last6Months"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,122,89,0.08) 100%)"
                    : undefined,
                boxShadow:
                  activeQuickFilter === "last6Months"
                    ? "0 8px 32px rgba(255,122,89,0.15), 0 0 0 1px rgba(255,122,89,0.1)"
                    : undefined,
              }}
              onClick={() => handleQuickFilter("last6Months")}
              style={{
                background:
                  activeQuickFilter === "last6Months"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,122,89,0.08) 100%)"
                    : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`mb-2 transition-colors duration-300 ${
                      activeQuickFilter === "last6Months"
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "16px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    Last 6 Months
                    {activeQuickFilter === "last6Months" && (
                      <span className="ml-2 text-xs bg-primary/90 text-white px-3 py-1 rounded-full shadow-md font-medium">
                        Active
                      </span>
                    )}
                  </p>
                  <p
                    className={`transition-colors duration-300 ${
                      activeQuickFilter === "last6Months"
                        ? "text-foreground font-medium"
                        : "text-foreground"
                    }`}
                    style={{
                      fontSize: "28px",
                      fontFamily: "var(--font-family-primary)",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    ${last6MonthsExpenses.toFixed(2)}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    activeQuickFilter === "last6Months"
                      ? "bg-primary/30 scale-110 shadow-lg ring-2 ring-primary/20"
                      : "bg-chart-4/10 group-hover:bg-primary/15"
                  }`}
                >
                  <CalendarDays
                    className={`w-6 h-6 transition-colors duration-300 ${
                      activeQuickFilter === "last6Months"
                        ? "text-primary"
                        : "text-chart-4"
                    }`}
                  />
                </div>
              </div>
            </Card>

            {/* This Year Card - Clickable Quick Filter */}
            <Card
              className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 group relative overflow-hidden ${
                activeQuickFilter === "thisYear"
                  ? "bg-white/95 border-primary/60 shadow-2xl ring-2 ring-primary/30 backdrop-blur-sm"
                  : "bg-card border-border hover:border-primary/20 hover:bg-white/98"
              }`}
              style={{
                background:
                  activeQuickFilter === "thisYear"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,122,89,0.08) 100%)"
                    : undefined,
                boxShadow:
                  activeQuickFilter === "thisYear"
                    ? "0 8px 32px rgba(255,122,89,0.15), 0 0 0 1px rgba(255,122,89,0.1)"
                    : undefined,
              }}
              onClick={() => handleQuickFilter("thisYear")}
              style={{
                background:
                  activeQuickFilter === "thisYear"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,122,89,0.08) 100%)"
                    : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`mb-2 transition-colors duration-300 ${
                      activeQuickFilter === "thisYear"
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "16px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    This Year Total
                    {activeQuickFilter === "thisYear" && (
                      <span className="ml-2 text-xs bg-primary/90 text-white px-3 py-1 rounded-full shadow-md font-medium">
                        Active
                      </span>
                    )}
                  </p>
                  <p
                    className={`transition-colors duration-300 ${
                      activeQuickFilter === "thisYear"
                        ? "text-foreground font-medium"
                        : "text-foreground"
                    }`}
                    style={{
                      fontSize: "28px",
                      fontFamily: "var(--font-family-primary)",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    ${currentYearExpenses.toFixed(2)}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    activeQuickFilter === "thisYear"
                      ? "bg-primary/30 scale-110 shadow-lg ring-2 ring-primary/20"
                      : "bg-primary/10 group-hover:bg-primary/15"
                  }`}
                >
                  <TrendingUp
                    className={`w-6 h-6 transition-colors duration-300 ${
                      activeQuickFilter === "thisYear"
                        ? "text-primary"
                        : "text-primary"
                    }`}
                  />
                </div>
              </div>
            </Card>

            {/* Filtered Total Card - Non-clickable, shows current filter results */}
            <Card className="bg-card border-border rounded-2xl p-6 relative overflow-hidden">
              {/* Subtle animated background for filtered results */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p
                    className="text-muted-foreground mb-2"
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "16px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    {activeQuickFilter
                      ? "Filtered Results"
                      : analyticsSelectedCategories.length === 0
                        ? "All Expenses"
                        : "Selected Total"}
                    {activeQuickFilter && (
                      <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                        {activeQuickFilter === "lastMonth"
                          ? "Last Month"
                          : activeQuickFilter === "last6Months"
                            ? "6 Months"
                            : activeQuickFilter === "thisYear"
                              ? "This Year"
                              : "Filtered"}
                      </span>
                    )}
                  </p>
                  <p
                    className="text-foreground"
                    style={{
                      fontSize: "28px",
                      fontFamily: "var(--font-family-primary)",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    ${analyticsFilteredTotal.toFixed(2)}
                  </p>
                </div>
                <div className="bg-accent/10 p-4 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Compact Analytics Filter */}
<div className="rounded-3xl p-4 md:p-5 bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg">
  <div className="flex flex-wrap items-center gap-3 md:gap-4">
    {/* All Categories pill (acts as toggle for the analytics filter panel) */}
    <Button
      onClick={() => setShowAnalyticsFilters(!showAnalyticsFilters)}
      className="h-12 md:h-14 px-4 md:px-5 rounded-2xl bg-muted/70 hover:bg-muted text-foreground flex items-center gap-3"
      style={{
        fontSize: '16px',
        fontFamily: 'var(--font-family-primary)',
        fontWeight: 'var(--font-weight-regular)',
      }}
    >
      <Filter className="w-5 h-5" />
      {getSelectedCategoriesText()}
      {getActiveFiltersCount() > 0 && (
        <Badge className="ml-1 bg-background/30 text-foreground">{getActiveFiltersCount()}</Badge>
      )}
    </Button>

    {/* Month */}
    <div className="flex items-center gap-2">
      <span
        className="text-muted-foreground hidden sm:inline"
        style={{ fontSize: 16, fontFamily: 'var(--font-family-primary)' }}
      >
        Month:
      </span>
      <Select
        value={analyticsSelectedMonth}
        onValueChange={(v) => {
          setAnalyticsSelectedMonth(v);
          setActiveQuickFilter(null);
        }}
      >
        <SelectTrigger className="h-12 md:h-14 w-44 md:w-48 rounded-2xl bg-input-background border-border text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border rounded-xl shadow-lg">
          <SelectItem value="all" className="text-foreground">All Months</SelectItem>
          {availableMonths.map((m) => (
            <SelectItem key={m} value={m.toString()} className="text-foreground">
              {getMonthName(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Year */}
    <div className="flex items-center gap-2">
      <span
        className="text-muted-foreground hidden sm:inline"
        style={{ fontSize: 16, fontFamily: 'var(--font-family-primary)' }}
      >
        Year:
      </span>
      <Select
        value={analyticsSelectedYear}
        onValueChange={(v) => {
          setAnalyticsSelectedYear(v);
          setActiveQuickFilter(null);
        }}
      >
        <SelectTrigger className="h-12 md:h-14 w-36 md:w-40 rounded-2xl bg-input-background border-border text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border rounded-xl shadow-lg">
          <SelectItem value="all" className="text-foreground">All Years</SelectItem>
          {availableYears.map((y) => (
            <SelectItem key={y} value={y.toString()} className="text-foreground">
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Right actions */}
    <div className="ml-auto flex items-center gap-3">
      <Button
        onClick={selectAllCategories}
        className="h-10 md:h-12 px-4 rounded-2xl bg-[#C8B5FF] hover:bg-[#bca6ff] text-[#4B2EFF]"
        style={{ fontSize: 14, fontFamily: 'var(--font-family-primary)' }}
      >
        Select All
      </Button>

      <Button
        onClick={clearAllAnalyticsFilters}
        disabled={getActiveFiltersCount() === 0}
        className={`h-10 md:h-12 px-4 rounded-2xl ${
          getActiveFiltersCount() === 0
            ? 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
            : 'bg-[#FFE1E1] text-[#E5484D] hover:bg-[#ffd4d4]'
        }`}
        style={{ fontSize: 14, fontFamily: 'var(--font-family-primary)' }}
      >
        Clear All
      </Button>
    </div>
  </div>

  {/* Expandable category checklist (unchanged logic, styled to match) */}
  {showAnalyticsFilters && (
    <div className="w-full border-t border-border/50 pt-4 mt-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted/40 cursor-pointer transition-colors"
            onClick={() => toggleCategory(category)}
          >
            <Checkbox
              checked={analyticsSelectedCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
              className="border-border h-4 w-4"
            />
            <div
              className={`w-3 h-3 rounded-full ${categoryColorClasses[category as keyof typeof categoryColorClasses]}`}
            />
            <p
              className="text-foreground flex-1 truncate"
              style={{ fontSize: 13, fontFamily: 'var(--font-family-primary)' }}
            >
              {category}
            </p>
            {analyticsSelectedCategories.includes(category) && <Check className="w-4 h-4 text-primary" />}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
          {/* Desktop Analytics Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <Card className="bg-card border-border rounded-2xl p-8">
              {pieChartData.length > 0 ? (
                <div>
                  <h2
                    className="text-foreground mb-6 text-center"
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "28px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    {analyticsSelectedCategories.length === 0
                      ? "Spending Breakdown"
                      : analyticsSelectedCategories.length === 1
                        ? `${analyticsSelectedCategories[0]} Breakdown`
                        : "Selected Categories Breakdown"}
                  </h2>

                  <div className="h-96 w-full">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomLabel}
                          innerRadius={80}
                          outerRadius={160}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p
                    className="text-muted-foreground"
                    style={{
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "18px",
                      fontWeight: "var(--font-weight-regular)",
                    }}
                  >
                    No expenses found for the selected
                    categories
                  </p>
                </div>
              )}
            </Card>

            {/* Category Details */}
            <Card className="bg-card border-border rounded-2xl p-8">
              <h3
                className="text-foreground mb-6"
                style={{
                  fontFamily: "var(--font-family-primary)",
                  fontSize: "28px",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                {analyticsSelectedCategories.length === 0
                  ? "Top Categories"
                  : analyticsSelectedCategories.length === 1
                    ? `${analyticsSelectedCategories[0]} Details`
                    : "Selected Categories"}
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analyticsCategoryTotals.map(
                  ([category, amount]) => {
                    const percentage =
                      analyticsFilteredTotal > 0
                        ? (
                            (amount / analyticsFilteredTotal) *
                            100
                          ).toFixed(1)
                        : "0";
                    const categoryColor =
                      categoryColors[
                        category as keyof typeof categoryColors
                      ];

                    return (
                      <div
                        key={category}
                        className="relative overflow-hidden rounded-xl border border-border/50 transition-all duration-200 hover:border-border hover:shadow-md cursor-pointer group"
                        style={{
                          background: `linear-gradient(135deg, ${categoryColor}08 0%, ${categoryColor}12 100%)`,
                        }}
                      >
                        {/* Progress bar background */}
                        <div
                          className="absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-300 group-hover:opacity-30"
                          style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${categoryColor}40 0%, ${categoryColor}60 100%)`,
                          }}
                        />

                        {/* Content */}
                        <div className="relative flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full shadow-sm border-2 border-white/50"
                              style={{
                                backgroundColor: categoryColor,
                              }}
                            ></div>
                            <p
                              className="text-foreground"
                              style={{
                                fontSize: "16px",
                                fontFamily:
                                  "var(--font-family-primary)",
                                fontWeight:
                                  "var(--font-weight-regular)",
                              }}
                            >
                              {category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-foreground"
                              style={{
                                fontSize: "18px",
                                fontFamily:
                                  "var(--font-family-primary)",
                                fontWeight:
                                  "var(--font-weight-regular)",
                              }}
                            >
                              ${amount.toFixed(2)}
                            </p>
                            <p
                              className="text-muted-foreground"
                              style={{
                                fontSize: "14px",
                                fontFamily:
                                  "var(--font-family-primary)",
                                fontWeight:
                                  "var(--font-weight-regular)",
                              }}
                            >
                              {percentage}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl mx-auto bg-card border-border rounded-2xl p-8 animate-in zoom-in-95 duration-300 z-[60] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
              <h2
                className="text-foreground"
                style={{
                  fontSize: "32px",
                  fontFamily: "var(--font-family-primary)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Expense History
              </h2>
              <Button
                onClick={() => setShowHistory(false)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl p-3 h-12 w-12"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {historicalExpensesByMonth.sortedMonths.length ===
            0 ? (
              <div className="text-center py-20">
                <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "18px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  No historical data available yet
                </p>
                <p
                  className="text-muted-foreground mt-2"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "14px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Start adding expenses to build your history
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between bg-muted/30 rounded-2xl p-4">
                  <Button
                    onClick={() => navigateHistoryMonth("prev")}
                    disabled={
                      historicalExpensesByMonth.sortedMonths.indexOf(
                        selectedHistoryMonth,
                      ) === 0
                    }
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 h-12 w-12"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="text-center">
                    <h3
                      className="text-foreground"
                      style={{
                        fontSize: "24px",
                        fontFamily:
                          "var(--font-family-primary)",
                        fontWeight:
                          "var(--font-weight-regular)",
                      }}
                    >
                      {formatMonthDisplay(selectedHistoryMonth)}
                    </h3>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "16px",
                        fontFamily:
                          "var(--font-family-primary)",
                        fontWeight:
                          "var(--font-weight-regular)",
                      }}
                    >
                      Total: ${selectedMonthTotal.toFixed(2)} •{" "}
                      {selectedMonthHistoryExpenses.length}{" "}
                      expenses
                    </p>
                  </div>

                  <Button
                    onClick={() => navigateHistoryMonth("next")}
                    disabled={
                      historicalExpensesByMonth.sortedMonths.indexOf(
                        selectedHistoryMonth,
                      ) ===
                      historicalExpensesByMonth.sortedMonths
                        .length -
                        1
                    }
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 h-12 w-12"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Month Selector Pills */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {historicalExpensesByMonth.sortedMonths.map(
                    (monthKey) => (
                      <Button
                        key={monthKey}
                        onClick={() =>
                          setSelectedHistoryMonth(monthKey)
                        }
                        className={`rounded-xl px-4 py-2 transition-all duration-200 ${
                          selectedHistoryMonth === monthKey
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        }`}
                        style={{
                          fontSize: "14px",
                          fontFamily:
                            "var(--font-family-primary)",
                          fontWeight:
                            "var(--font-weight-regular)",
                        }}
                      >
                        {formatMonthDisplay(monthKey)}
                      </Button>
                    ),
                  )}
                </div>

                {/* Selected Month Expenses */}
                <div className="space-y-4">
                  {selectedMonthHistoryExpenses.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-2xl">
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontFamily:
                            "var(--font-family-primary)",
                          fontSize: "16px",
                          fontWeight:
                            "var(--font-weight-regular)",
                        }}
                      >
                        No expenses found for{" "}
                        {formatMonthDisplay(
                          selectedHistoryMonth,
                        )}
                      </p>
                    </div>
                  ) : (
                    selectedMonthHistoryExpenses
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={`w-4 h-4 rounded-full ${categoryColorClasses[expense.category as keyof typeof categoryColorClasses]}`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <p
                                  className="text-foreground truncate"
                                  style={{
                                    fontSize: "16px",
                                    fontFamily:
                                      "var(--font-family-primary)",
                                    fontWeight:
                                      "var(--font-weight-regular)",
                                  }}
                                >
                                  {expense.title}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className="bg-secondary/50 text-secondary-foreground rounded-lg"
                                  style={{
                                    fontSize: "12px",
                                    fontFamily:
                                      "var(--font-family-primary)",
                                    fontWeight:
                                      "var(--font-weight-regular)",
                                  }}
                                >
                                  {expense.category}
                                </Badge>
                              </div>
                              <div className="flex gap-4 text-muted-foreground">
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontFamily:
                                      "var(--font-family-primary)",
                                    fontWeight:
                                      "var(--font-weight-regular)",
                                  }}
                                >
                                  {new Date(
                                    expense.date,
                                  ).toLocaleDateString()}
                                </p>
                                {expense.description && (
                                  <p
                                    className="truncate"
                                    style={{
                                      fontSize: "14px",
                                      fontFamily:
                                        "var(--font-family-primary)",
                                      fontWeight:
                                        "var(--font-weight-regular)",
                                    }}
                                  >
                                    {expense.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <p
                              className="text-foreground"
                              style={{
                                fontSize: "20px",
                                fontFamily:
                                  "var(--font-family-primary)",
                                fontWeight:
                                  "var(--font-weight-regular)",
                              }}
                            >
                              ${expense.amount.toFixed(2)}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleEdit(expense);
                                  setShowHistory(false);
                                }}
                                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg p-3 h-10 w-10"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleDelete(expense.id)
                                }
                                className="bg-destructive-foreground/10 text-destructive-foreground hover:bg-destructive-foreground/20 rounded-lg p-3 h-10 w-10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar Modal */}
{showCalendarModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
    {/* Backdrop */}
    <button
      aria-label="Close calendar"
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowCalendarModal(false)}
    />

    {/* Modal card */}
    <div
      className="relative z-[110] w-full max-w-lg rounded-3xl bg-[var(--card)] shadow-2xl border border-[var(--border)]"
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-family-primary)",
            fontSize: "28px",
            fontWeight: "var(--font-weight-regular)",
          }}
        >
          Select Date
        </h2>

        <button
          onClick={() => setShowCalendarModal(false)}
          className="h-10 w-10 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Calendar area */}
      <div className="px-6 sm:px-8 pb-6">
        <div className="rounded-2xl bg-muted/20 border border-border/50 p-5 sm:p-6">
          {/* Lock the calendar to a compact width so it doesn't stretch */}
          <div className="mx-auto w-[320px]">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
              className="rounded-xl border-0 text-base"
        />
      </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
          type="button"
          onClick={() => {
            const t = new Date();
              const local = new Date(t.getFullYear(), t.getMonth(), t.getDate());
              handleDateSelect(local);
          }}
            className="h-12 rounded-2xl bg-primary/15 text-primary hover:bg-primary/25 transition"
          style={{
              fontSize: "16px",
            fontFamily: "var(--font-family-primary)",
            fontWeight: "var(--font-weight-regular)",
          }}
        >
          Today
          </button>

          <button
          type="button"
          onClick={() => {
            const t = new Date();
              const y = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1);
              handleDateSelect(y);
          }}
            className="h-12 rounded-2xl bg-accent/15 text-accent hover:bg-accent/25 transition"
          style={{
              fontSize: "16px",
            fontFamily: "var(--font-family-primary)",
            fontWeight: "var(--font-weight-regular)",
          }}
        >
          Yesterday
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Desktop Modal - Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={resetForm}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md mx-auto bg-card border-border rounded-2xl p-8 animate-in zoom-in-95 duration-300 z-[60] shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2
                className="text-foreground"
                style={{
                  fontSize: "28px",
                  fontFamily: "var(--font-family-primary)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                {editingExpense
                  ? "Edit Expense"
                  : "Add New Expense"}
              </h2>
              <Button
                onClick={resetForm}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl p-3 h-12 w-12"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="text-foreground block mb-3"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Title
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter expense title"
                  required
                  className="bg-input-background border-border text-foreground rounded-xl h-14"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-foreground block mb-3"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  required
                  className="bg-input-background border-border text-foreground rounded-xl h-14"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-foreground block mb-3"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value,
                    })
                  }
                  required
                >
                  <SelectTrigger className="bg-input-background border-border text-foreground rounded-xl h-14">
                    <SelectValue
                      placeholder="Select category"
                      style={{
                        fontFamily:
                          "var(--font-family-primary)",
                        fontSize: "16px",
                        fontWeight:
                          "var(--font-weight-regular)",
                      }}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-card border-border rounded-xl shadow-lg z-[70]"
                    style={{
                      backgroundColor: "var(--card)",
                    }}
                  >
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-foreground hover:bg-muted/50 cursor-pointer p-3"
                        style={{
                          fontFamily:
                            "var(--font-family-primary)",
                          fontSize: "16px",
                          fontWeight:
                            "var(--font-weight-regular)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor:
                                categoryColors[
                                  category as keyof typeof categoryColors
                                ],
                            }}
                          />
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className="text-foreground block mb-3"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Date
                </label>
                <Button
                  type="button"
                  onClick={() => setShowCalendarModal(true)}
                  className="w-full justify-start text-left bg-input-background border border-border text-foreground hover:bg-input-background/90 rounded-xl h-14 px-4"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                  {formData.date ? (
                    formatDateDisplay(formData.date)
                  ) : (
                    <span className="text-muted-foreground">
                      Pick a date
                    </span>
                  )}
                </Button>
              </div>
              <div>
                <label
                  className="text-foreground block mb-3"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Description (Optional)
                </label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter description"
                  className="bg-input-background border-border text-foreground rounded-xl h-14"
                  style={{
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "16px",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-14"
                  style={{
                    fontSize: "16px",
                    fontFamily: "var(--font-family-primary)",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  {editingExpense
                    ? "Update Expense"
                    : "Add Expense"}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl h-14"
                  style={{
                    fontSize: "16px",
                    fontFamily: "var(--font-family-primary)",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}