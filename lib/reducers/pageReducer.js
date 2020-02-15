import { updateObject } from '../utils';


const pageReducer = (state, action) => {
    const changePage = (state, action) => {
        return updateObject(
            state,
            {activePage: action.pageId}
        );
    }

    const setPages = (state, action) => {
      return updateObject(
          state,
          {
              activePage: action.pagePermissions.activePage,
              pages: action.pages.filter(p => action.pagePermissions.pages.includes(p.type))
          }
      );
    }

    const refreshPage = (state, action) => {
        return state;
    }

    const pageHandlers = {
        CHANGE_PAGE: changePage,
        REFRESH_PAGE: refreshPage,
        SET_PAGES: setPages,
        DEFAULT: (state, action) => (state)
    }

    return (pageHandlers[action.type] || pageHandlers['DEFAULT'])(state, action);
}

export default pageReducer;
