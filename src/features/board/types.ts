export interface Column {
  id: string;
  title: string;
  collapsed: boolean;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}
