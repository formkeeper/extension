export const STORAGE_KEY = "formkeeper_store";
// SAVE_AFTER_TIME controls the time to save each snapshot after the debounced
// event (ie. change event)
export const SAVE_AFTER_TIME = 1e3;

// Note: GROUP_TIMEWINDOW / GROUP_TIMEFRAME = Number of max. items in general
// view.
//
// GROUP_TIMEFRAME is the time (in seconds) span between snapshot groups
// displayed in the sidebar when the general view is active. Keep in mind this
// is the max. items, the final number will depend on the number of snapshots.
export const GROUP_TIMEFRAME = 10;
// GROUP_TOTAL is the window time (in seconds) that will be displayed in the
// sidebar when the general view is active
export const GROUP_TIMEWINDOW = 100;
// GROUP_MAX_SNAPSHOT_SEARCH_ITERATIONS is the maximum number of iterations
// after which the last snapshot search will stop. This is also delimited by
// the number of snapshots: a search will never loop more iterations than the
// number of snapshots.
//
// This constant can be tweaked so snapshots which are too old doesn't display
// in sidebar
export const GROUP_MAX_SNAPSHOT_SEARCH_ITERATIONS = 100;