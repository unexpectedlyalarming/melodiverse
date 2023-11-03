type Note = | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type Mode = 'major' | 'minor';

type Key = `${Note} ${Mode}`

export default Key;