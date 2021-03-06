import fs from 'fs-extra';
import path from 'path-extra';
import { getGroupsData } from '../selectors';
import { saveGroupData } from '../helpers/groupDataHelpers';

/**
 * Save verse edit in translationWords to file system
 * @param {*} verseEdit - record that is saved to file system
 *  {{
      verseBefore: String,
      verseAfter: String,
      tags: Array,
      userName: String,
      activeBook: String,
      activeChapter: Number,
      activeVerse: Number,
      modifiedTimestamp: String,
      gatewayLanguageCode: String,
      gatewayLanguageQuote: String,
      contextId: Object
    }}
 * @param {string} projectSaveLocation - path to project.
 */
export const writeTranslationWordsVerseEditToFile = (verseEdit, projectSaveLocation) => {
  verseEdit.gatewayLanguageQuote = verseEdit.gatewayLanguageQuote || '';
  const newFilename = verseEdit.modifiedTimestamp + '.json';
  const verseEditsPath = path.join(projectSaveLocation, '.apps', 'translationCore', 'checkData', 'verseEdits',
    verseEdit.activeBook, verseEdit.contextId.reference.chapter.toString(),
    verseEdit.contextId.reference.verse.toString());
  fs.ensureDirSync(verseEditsPath);

  const filePath = path.join(verseEditsPath, newFilename.replace(/[:"]/g, '_'));
  fs.outputJSONSync(filePath, verseEdit, { spaces: 2 });
};

/**
 * update the group data for edited verses
 * @param {object} state
 * @param {object} editedChecks - groups with edited verses
 * @param {string} toolName
 * @param {string} projectSaveLocation
 */
export function updateGroupDataIndexForVerseEdits(state, editedChecks, toolName, projectSaveLocation) {
  const groupsData = getGroupsData(state);
  const editedGroups = Object.keys(editedChecks);

  for (let i = 0, l = editedGroups.length; i < l; i++) {
    const groupID = editedGroups[i];
    const groupData = groupsData[groupID];
    saveGroupData(toolName, projectSaveLocation, groupID, groupData);
  }
}
