import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TranslationHelps } from 'tc-ui-toolkit';
// helpers
import * as tHelpsHelpers from '../helpers/tHelpsHelpers';

// resourcesReducer needs to be global so that the followTHelpsLink has the new article's content
let resourcesReducer = {};

function useTnArticleState(initialState) {
  const [
    {
      showHelpsModal, modalArticle, articleCategory,
    },
    setTnArticleState,
  ] = useState(initialState);

  return {
    showHelpsModal,
    modalArticle,
    articleCategory,
    setThState: (updatedValues) => {
      setTnArticleState(prevState => ({ ...prevState, ...updatedValues }));
    },
  };
}

function TranslationHelpsWrapper({
  toolsSelectedGLs,
  toolsReducer: { currentToolName },
  contextId,
  showHelps,
  toggleHelps,
  translate,
  actions,
  resourcesReducer: resourcesReducerProp,
}) {
  resourcesReducer = resourcesReducerProp;

  const initialState = {
    showHelpsModal: false,
    modalArticle: '',
    articleCategory: '',
  };
  const {
    showHelpsModal,
    modalArticle,
    articleCategory,
    setThState,
  } = useTnArticleState(initialState);
  const groupId = contextId.groupId;
  const languageId = toolsSelectedGLs[currentToolName];

  /**
   * extract article from reducer if present.
   * @param {String} resourceType - subpath for resource such as 'translationAcademy'
   * @param {String} article - name of article to find
   * @return {String|null} - returns article if found
   */
  function getArticleFromReducer(resourceType, article) {
    const resources = resourcesReducer.translationHelps[resourceType];
    let articleData = resources && resources[article];
    return articleData;
  }

  /**
   * load the resource article for the link and display
   * @param {String} link
   * @return {boolean}
   */
  function followTHelpsLink(link) {
    const linkParts = link.split('/'); // link format: <lang>/<resource>/<category>/<article>
    const [lang, type, category, article] = linkParts;
    const resourceSubDir = tHelpsHelpers.getResourceDirByType(type);
    let articleData = getArticleFromReducer(resourceSubDir, article);

    if (!articleData) { // if not cached
      actions.loadResourceArticle(resourceSubDir, article, lang, category); // do synchronous load
      articleData = getArticleFromReducer(resourceSubDir, article);
    }
    setThState({
      showHelpsModal: true,
      modalArticle: articleData || 'Cannot find an article for ' + link,
      articleCategory: category,
    });
    return true;
  }
  window.followLink = followTHelpsLink;

  useEffect(() => {
    actions.loadResourceArticle(currentToolName, groupId, languageId, '', true); // do asynchronous load
  }, [actions, currentToolName, groupId, languageId]);

  useEffect(() => {
    const page = document.getElementById('helpsbody');

    if (page) {
      page.scrollTop = 0;
    }
  }, [contextId]);

  function toggleHelpsModal() {
    setThState({
      showHelpsModal: !showHelpsModal,
      modalArticle: '',
    });
  }

  const currentFile = tHelpsHelpers.getArticleFromState(resourcesReducer, contextId, currentToolName);
  const currentFileMarkdown = tHelpsHelpers.convertMarkdownLinks(currentFile, languageId);
  const tHelpsModalMarkdown = tHelpsHelpers.convertMarkdownLinks(modalArticle, languageId, articleCategory);

  return (
    <TranslationHelps
      translate={translate}
      article={currentFileMarkdown}
      modalArticle={tHelpsModalMarkdown}
      openExpandedHelpsModal={toggleHelpsModal}
      isShowHelpsSidebar={showHelps}
      sidebarToggle={toggleHelps}
      isShowHelpsExpanded={showHelpsModal} />
  );
}

TranslationHelpsWrapper.propTypes = {
  toolsSelectedGLs: PropTypes.object,
  translate: PropTypes.func,
  resourcesReducer: PropTypes.object,
  contextId: PropTypes.object.isRequired,
  toolsReducer: PropTypes.object,
  actions: PropTypes.shape({ loadResourceArticle: PropTypes.func.isRequired }),
  showHelps: PropTypes.bool.isRequired,
  toggleHelps: PropTypes.func.isRequired,
};

TranslationHelpsWrapper.defaultProps = { contextId: {} };

export default TranslationHelpsWrapper;
