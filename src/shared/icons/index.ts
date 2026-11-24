/**
 * Icon registry. Components import icons from here (never from `ionicons/icons` directly),
 * so swapping an icon set only touches this file.
 * Custom glyphs reproduce icons from the design that Ionicons does not ship.
 */
export {
  add as addIcon,
  attachOutline as attachmentIcon,
  calendarClearOutline as calendarIcon,
  checkboxOutline as checklistIcon,
  checkmark as checkIcon,
  chevronDown as chevronDownIcon,
  close as closeIcon,
  documentOutline as fileIcon,
  ellipsisVertical as moreIcon,
  funnelOutline as filterIcon,
  lockClosedOutline as lockIcon,
  personAddOutline as inviteIcon,
  searchOutline as searchIcon,
  trashOutline as trashIcon,
  linkOutline as linkIcon,
  cloudDownloadOutline as exportIcon,
  cloudUploadOutline as importIcon,
  refreshOutline as resetIcon,
} from 'ionicons/icons';

/** Ionicons expects the raw (not URI-encoded) SVG markup after the comma. */
const svg = (body: string, viewBox = '0 0 24 24') =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='${viewBox}' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'>${body.replace(/"/g, "'")}</svg>`;

/** Two arrows pointing inwards — "collapse column". */
export const collapseIcon = svg(
  '<path d="M20 4l-6 6"/><path d="M14 5.5V10h4.5"/><path d="M4 20l6-6"/><path d="M10 18.5V14H5.5"/>',
);

/** Two arrows pointing outwards — "expand column". */
export const expandIcon = svg(
  '<path d="M14 10l6-6"/><path d="M15.5 4H20v4.5"/><path d="M10 14l-6 6"/><path d="M8.5 20H4v-4.5"/>',
);

/** Stopwatch — due date chip. */
export const timerIcon = svg(
  '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.8"/><path d="M9.5 2.8h5"/><path d="M18.3 6.2l1.2-1.2"/>',
);

/** Picture with a plus — "add cover image" / attachments. */
export const addPhotoIcon = svg(
  '<path d="M20 12.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V6a1.5 1.5 0 0 1 1.5-1.5H12"/><path d="M7 17l3.2-4 2.3 2.8 1.8-2.1L17 17z" fill="currentColor" stroke-width="1"/><path d="M18 2.5v6"/><path d="M15 5.5h6"/>',
);

/** Outline pencil — inline edit affordance. */
export const editIcon = svg(
  '<path d="M4 20h3.5L18.2 9.3a2 2 0 0 0 0-2.8l-.7-.7a2 2 0 0 0-2.8 0L4 16.5z"/><path d="M13.5 7l3.5 3.5"/>',
);

/** Circular arrows with a currency mark — "Export / Import". */
export const exchangeIcon = svg(
  '<path d="M4.5 9.5A8 8 0 0 1 19 7"/><path d="M19.5 3.5V7.2h-3.7"/><path d="M19.5 14.5A8 8 0 0 1 5 17"/><path d="M4.5 20.5v-3.7h3.7"/><path d="M13.6 9.6c-.4-.6-1-.9-1.7-.9-1 0-1.8.6-1.8 1.4 0 1.9 3.8 1 3.8 3 0 .8-.8 1.5-1.9 1.5-.8 0-1.5-.4-1.9-1"/><path d="M12 7.6v1.1M12 14.6v1.1"/>',
);
