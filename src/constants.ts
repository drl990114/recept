// fiber worktags
export const HostRoot /**                 */ = 0
export const FunctionComponent /**        */ = 1
export const HostComponent /**            */ = 2
export const HostText /**                 */ = 3

export const ELEMENT_TEXT = '#text'

// fiber effect flag
export const PLACEMENT /**                */ = Symbol.for('PLACEMENT')
export const UPDATE /**                   */ = Symbol.for('UPDATE')
export const DELETION /**                 */ = Symbol.for('DELETION')

// hook effect flag
export const DEPENDEXEC /**               */ = Symbol.for('DEPENDEXEC')
export const ONCE /**                     */ = Symbol.for('ONCE')
export const NOHOOKEFFECT /**             */ = Symbol.for('NOHOOKEFFECT')

export const DEPENDEXECLAYOUT /**               */ = Symbol.for('DEPENDEXECLAYOUT')
export const ONCELAYOUT /**                     */ = Symbol.for('ONCELAYOUT')
