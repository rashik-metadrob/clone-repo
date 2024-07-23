import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();
  const closeMenuOnNavigation = () => {
      const menuCheckbox = document.getElementById('menuu-btn');
      if (menuCheckbox && menuCheckbox.checked) {
        menuCheckbox.checked = false;
      }
    };

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(-1, 0);
    closeMenuOnNavigation();
    console.log(pathname,"pathname")
  }, [pathname]);
}

export default ScrollToTop;
