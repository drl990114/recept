// fiber worktags
export const HostRoot /**               */ = 0
export const FunctionComponent /**      */ = 1
export const HostComponent /**          */ = 2
export const HostText /**               */ = 3

// fiber effect flag
export const PLACEMENT /**              */ = Symbol.for('PLACEMENT')
export const UPDATE /**                 */ = Symbol.for('UPDATE')
export const DELETION /**               */ = Symbol.for('DELETION')

export const ELEMENT_TEXT = '#text'

// hook effect flag
export const DEPENDEXEC /**              */ = Symbol.for('DEPENDEXEC')
export const ONCE /**            */ = Symbol.for('ONCE')
export const NOHOOKEFFECT /**             */ = Symbol.for('NOHOOKEFFECT')
