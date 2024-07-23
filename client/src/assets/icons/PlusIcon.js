function PlusIcon({
  color = 'black'
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M6 1V11" stroke={color} strokeLinecap="round"/>
  <path d="M11 6L1 6" stroke={color} strokeLinecap="round"/>
  </svg>
}

export default PlusIcon;
