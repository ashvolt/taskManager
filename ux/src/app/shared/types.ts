export interface TaskItem {
    id: string;
    title: string;
    description:string;
    status:string;
    percentage:string;
    createdDateTime:string;
    priority:string,
    assignee?:string
  }

export interface StatusDetails {
  status:string;
  count:number;
  high:number;
  low:number;
  medium:number;
}