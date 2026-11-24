import type { Board } from '@/features/board/types';
import type { Attachment, Subtask, Task, TaskDraft } from '@/features/task/types';
import { POSITION_STEP } from '@/features/task/utils/position';

/** Seed content mirrors the reference design so the first load looks identical. */
export const SEED_BOARDS: Board[] = [
  {
    id: 'b_adhivasindo',
    name: 'Adhivasindo',
    columns: [
      { id: 'c_todo', title: 'To do', collapsed: false },
      { id: 'c_doing', title: 'Doing', collapsed: false },
      { id: 'c_review', title: 'Review', collapsed: false },
      { id: 'c_done', title: 'Done', collapsed: false },
      { id: 'c_rework', title: 'Rework', collapsed: false },
    ],
  },
  {
    id: 'b_northern',
    name: 'Northern Light',
    columns: [
      { id: 'c_nl_todo', title: 'To Do', collapsed: false },
      { id: 'c_nl_doing', title: 'Doing', collapsed: false },
      { id: 'c_nl_done', title: 'Done', collapsed: false },
    ],
  },
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=720&q=70&auto=format&fit=crop`;

/** Dummy cover images (allowed by the brief). */
export const COVERS = {
  interior: unsplash('1618221195710-dd6b41faaea6'),
  facade: unsplash('1486406146926-c627a92ad1ab'),
  tower: unsplash('1545324418-cc1a3fa10c00'),
  kitchen: unsplash('1556911220-bff31c812dba'),
  curve: unsplash('1487958449943-2429e8be8625'),
};

const FILES = [
  { name: 'requirements.pdf', type: 'application/pdf', size: 248_000 },
  { name: 'wireframe-v2.fig', type: 'application/octet-stream', size: 1_830_000 },
  { name: 'screenshot.png', type: 'image/png', size: 412_000 },
  { name: 'notes.docx', type: 'application/msword', size: 36_000 },
  { name: 'brand-guideline.pdf', type: 'application/pdf', size: 3_100_000 },
];

let seq = 0;
const uid = (prefix: string) => `${prefix}seed${(seq++).toString(36)}`;

function checklist(done: number, total: number, titles: string[] = []): Subtask[] {
  return Array.from({ length: total }, (_, i) => ({
    id: uid('s_'),
    title: titles[i] ?? `Subtask ${i + 1}`,
    done: i < done,
  }));
}

function files(count: number): Attachment[] {
  return Array.from({ length: count }, (_, i) => ({ id: uid('a_'), ...FILES[i % FILES.length] }));
}

type SeedInput = Partial<TaskDraft> & Pick<TaskDraft, 'columnId' | 'title'>;

function build(boardId: string, rows: SeedInput[]): Task[] {
  const created = Date.now() - 3 * 86_400_000;
  const counters = new Map<string, number>();
  return rows.map((row) => {
    const index = counters.get(row.columnId) ?? 0;
    counters.set(row.columnId, index + 1);
    return {
      id: uid('t_'),
      boardId,
      position: (index + 1) * POSITION_STEP,
      description: '',
      assigneeIds: [],
      dueDate: null,
      label: null,
      priority: null,
      coverImage: null,
      subtasks: [],
      attachments: [],
      completed: false,
      ...row,
      activity: [{ id: uid('l_'), message: 'created this task', createdAt: created }],
      createdAt: created,
      updatedAt: created,
    };
  });
}

export function createSeedTasks(): Task[] {
  seq = 0;
  return build('b_adhivasindo', [
    // To do
    {
      columnId: 'c_todo',
      title: 'Research for a podcast and video website',
      description: 'Collect references for layout, audio player and video gallery patterns.',
      label: 'feature',
      priority: 'medium',
      dueDate: '2026-08-08',
      assigneeIds: ['m_bella', 'm_dimas'],
      subtasks: checklist(4, 17, [
        'Benchmark competitors',
        'List audio players',
        'Interview stakeholders',
      ]),
    },
    {
      columnId: 'c_todo',
      title: 'Debug checkout process for the e-commerce website',
      description: 'Payment step fails intermittently on mobile Safari.',
      label: 'bug',
      priority: 'urgent',
      assigneeIds: ['m_citra', 'm_fajar', 'm_andi'],
      subtasks: checklist(10, 19),
      attachments: files(3),
    },
    {
      columnId: 'c_todo',
      title: 'Moodboard for the office interior refresh',
      label: 'feature',
      coverImage: COVERS.interior,
      dueDate: '2026-08-15',
      assigneeIds: ['m_eka', 'm_bella'],
      subtasks: checklist(1, 6),
    },
    // Doing
    {
      columnId: 'c_doing',
      title: 'Design wireframes for the landing page revamp',
      label: 'feature',
      priority: 'high',
      dueDate: '2026-08-12',
      assigneeIds: ['m_andi', 'm_citra'],
      attachments: files(2),
    },
    {
      columnId: 'c_doing',
      title: 'Install and set up a marketing tool for team operations',
      label: 'undefined',
      coverImage: COVERS.facade,
      dueDate: '2026-08-14',
      assigneeIds: ['m_fajar', 'm_bella', 'm_andi'],
      subtasks: checklist(12, 20),
      attachments: files(4),
    },
    // Review
    {
      columnId: 'c_review',
      title: 'Create and refine logo designs for the UI brand',
      label: 'issue',
      coverImage: COVERS.tower,
      assigneeIds: ['m_eka', 'm_dimas'],
      subtasks: checklist(15, 19),
      attachments: files(5),
    },
    {
      columnId: 'c_review',
      title: 'Create an icon library for the project.',
      label: 'feature',
      dueDate: '2026-08-08',
      assigneeIds: ['m_bella', 'm_eka'],
      subtasks: checklist(7, 18),
    },
    // Done
    {
      columnId: 'c_done',
      title: 'Create the Email Page layout and necessary components',
      label: 'feature',
      completed: true,
      assigneeIds: ['m_eka', 'm_bella'],
      attachments: files(3),
    },
    {
      columnId: 'c_done',
      title: 'Enhance website usability through user feedback',
      label: 'feature',
      assigneeIds: ['m_andi', 'm_fajar'],
      attachments: files(1),
    },
    {
      columnId: 'c_done',
      title: 'Photo shoot for the kitchen product catalog',
      label: 'feature',
      coverImage: COVERS.kitchen,
      completed: true,
      assigneeIds: ['m_citra'],
      subtasks: checklist(6, 6),
    },
    // Rework
    {
      columnId: 'c_rework',
      title: 'Blog Edit Page Modification and Playlist Page Design',
      label: 'feature',
      dueDate: '2026-08-08',
      assigneeIds: ['m_fajar', 'm_bella'],
      subtasks: checklist(7, 22),
      attachments: files(2),
    },
    {
      columnId: 'c_rework',
      title: 'Plan and execute training sessions for new hires',
      label: 'issue',
      coverImage: COVERS.curve,
      dueDate: '2026-08-09',
      assigneeIds: ['m_citra', 'm_eka'],
      subtasks: checklist(5, 19),
    },
  ]);
}
