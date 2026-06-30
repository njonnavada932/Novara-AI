import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc, Timestamp
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";



export interface Task {
  id?: string;

  title: string;
  description: string;

  category: string;      // Work, Personal, Study, Health...

  priority: string;      // Low, Medium, High

  dueDate: Date;       // ISO date string

  completed: boolean;

  aiGenerated: boolean;  // Created by AI or manually

  voiceCreated: boolean; // Created by voice

  calendarSynced: true;

  reminderEnabled: boolean;

  createdAt: Date;

  updatedAt: Date;

  userId?: string;
  recurring?: boolean
repeatType?: "None" | "Daily" | "Weekly" | "Monthly" | "Custom"
repeatInterval?: number
}

export const addTask = async (task: Task) => {
 const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  await addDoc(collection(db, "tasks"), {
    ...task,
    userId: user.uid,
    calendarSynced:true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getTasks = async (userId: string) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    dueDate: data.dueDate.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}) as Task[];
};

export const deleteTask = async (id: string) => {
  await deleteDoc(doc(db, "tasks", id));
};

export const toggleTask = async (
  id: string,
  completed: boolean
) => {
  await updateDoc(doc(db, "tasks", id), {
    completed,
  });
};

export const getTaskStats = (tasks: Task[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let completed = 0;
  let pending = 0;
  let todayTasks = 0;
  let overdue = 0;

  tasks.forEach((task) => {
    // Safely convert to Date regardless of source
    let rawDue: Date;

    if (task.dueDate instanceof Date) {
      rawDue = task.dueDate;
    } else if ((task.dueDate as any)?.seconds !== undefined) {
      rawDue = new Date((task.dueDate as any).seconds * 1000);
    } else {
      rawDue = new Date(task.dueDate as any);
    }

    // ✅ Don't mutate original — clone before stripping time
    const due = new Date(rawDue);
    due.setHours(0, 0, 0, 0);

    if (task.completed) {
      completed++;
    } else {
      pending++;

      if (due.getTime() === today.getTime()) {
        todayTasks++;
      }

      if (due < today) {
        overdue++;
      }
    }
  });

  return { completed, pending, todayTasks, overdue };
};
export const updateTask = async (
  id: string,
  task: Partial<Task>
) => {
  await updateDoc(doc(db, "tasks", id), {
    ...task,
    updatedAt: Timestamp.now(),
  });
};