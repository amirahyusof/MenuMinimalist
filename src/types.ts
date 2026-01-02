
export type Category = 'Laju' | 'Lama';

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  ingredients: string[];
  link?: string;
}

export interface WeeklyPlan {
  id: string;
  recipes: Recipe[];
  createdAt: number;
  weekNumber: number;
  dateRange: string;
}
