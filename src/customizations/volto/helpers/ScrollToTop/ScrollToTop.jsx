import { memo } from 'react';
import { withRouter } from 'react-router-dom';

export const scrollTo = (scrollnumber = 0) =>
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: scrollnumber, left: 0, behavior: 'smooth' });
  });

const ScrollToTop = ({ children }) => {
  return children;
};

export default withRouter(
  memo(ScrollToTop, (prevProps, nextProps) => {
    const { location: prevLocation, history } = prevProps;
    const { location: nextLocation } = nextProps;
    const hash = nextLocation.state?.volto_scroll_hash || '';
    const offset = nextLocation.state?.volto_scroll_offset || 0;

    const locationChanged =
      nextLocation.pathname !== prevLocation.pathname && hash === '';

    const element = hash ? document.getElementById(hash) : null;

    if (locationChanged && history.action !== 'POP') {
      scrollTo(0);
    } else if (element && history.action !== 'POP') {
      scrollTo(element.offsetTop - offset);
    }
    return false;
  }),
);
