import isEqual from 'deep-equal';
import * as fromGrouspIndex from '../state/reducers/groupsIndexReducer';
import * as fromGroupsData from '../state/reducers/groupsDataReducer';
import * as fromContextId from '../state/reducers/contextIdReducer';
import { getAlignedGLTextHelper } from '../helpers/gatewayLanguageHelpers';
// constants
import {
  DEFAULT_MAX_SELECTIONS,
  TRANSLATION_NOTES,
  TN_MAX_SELECTIONS,
} from '../common/constants';

export const getGroupsIndex = (state) =>
  fromGrouspIndex.getGroupsIndex(state.tool.groupsIndexReducer);

export const getGroupsData = (state) =>
  fromGroupsData.getGroupsData(state.tool.groupsDataReducer);

export const getContextId = (state) =>
  fromContextId.getContext(state.tool.contextIdReducer);

export const getProjectManifest = (ownProps) => ownProps.tc.projectDetailsReducer.manifest;
export const getGatewayLanguage = (ownProps) => ownProps.tc.gatewayLanguage;
export const getToolName = (ownProps) => ownProps.tc.selectedToolName;
export const getProjectPath = (ownProps) => ownProps.tc.projectSaveLocation;
export const getUserData = (ownProps) => ownProps.tc.loginReducer.userdata;
export const getGatewayLanguageBibles = (ownProps) => ownProps.tc.resourcesReducer.bibles[getGatewayLanguage(ownProps)];
export const getBookName = (ownProps) => ownProps.tc.project.getBookName();
export const getTargetBible = (ownProps) => ownProps.tc.resourcesReducer.bibles.targetLanguage.targetBible;
export const getTranslationHelpsArticle = (state, contextId = {}) => {
  const article = state.tc.resourcesReducer.translationHelps[state.tc.selectedToolName];
  const { groupId = '' } = contextId;

  return article && groupId ? article[groupId] : '';
};
export const getCurrentGroup = (state) => {
  const groupsData = getGroupsData(state);
  const contextId = getContextId(state);
  let currentGroupItem;

  if (contextId && groupsData[contextId.groupId]) {
    currentGroupItem = groupsData[contextId.groupId].find(groupData => isEqual(groupData.contextId, contextId));
  } else {
    currentGroupItem = null;
  }
  return currentGroupItem;
};
export const getAlignedGLText = (state, ownProps) => {
  const contextId = getContextId(state);
  const glBibles = getGatewayLanguageBibles(state, ownProps);

  return getAlignedGLTextHelper(contextId, glBibles);
};
export const getMaximumSelections = toolName => (toolName === TRANSLATION_NOTES) ? TN_MAX_SELECTIONS : DEFAULT_MAX_SELECTIONS;
export const getTcState = (ownProps) => ownProps.tc;
export const getTranslateState = (state) => state.translate;


// TODO: Cleanup selector below
export const getBiblesState = (state) =>
  state.resourcesReducer.bibles;
export const getGroupsDataState = (state) => state.tc.groupsDataReducer.groupsData;
export const getGroupsIndexState = (state) => state.tc.groupsIndexReducer.groupsIndex;
export const getSelectedToolName = (state) => state.tc.selectedToolName;
export const getManifestState = (state) => state.projectDetailsReducer.manifest;
export const getContextIdState = (state) => state.contextIdReducer.contextId;
export const getToolsSelectedGLsState = (state) => state.projectDetailsReducer.manifest.toolsSelectedGLs;
export const getSelectionsState = (state) => state.selectionsReducer.selections;
export const getCurrentPaneSettingsState = (state) => {
  const { ScripturePane } = state.settingsReducer.toolsSettings;
  return ScripturePane ? ScripturePane.currentPaneSettings : [];
};
export const getTargetBibleState = (state) => state.tc.resourcesReducer.bibles.targetLanguage.targetBible;
export const getActionsState = (state) => state.tc.actions;
export const getCommentsReducerState = (state) => state.tc.commentsReducer;
export const getSelectionsReducerState = (state) => state.tc.selectionsReducer;
export const getRemindersReducerState = (state) => state.tc.remindersReducer;
export const getLegacyToolsReducerState = (state) => ({ currentToolName: state.tc.selectedToolName });
export const getResourcesReducerState = (state) => state.tc.resourcesReducer;
export const getContextIdReducerState = (state) => state.contextIdReducer;
export const getProjectDetailsReducerState = (state) => state.projectDetailsReducer;
