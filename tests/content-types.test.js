import test from 'ava';
import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Libraries that will be checked if they are contained within the retrieved content type cache
 *
 * @type {Array}
 */
const coreLibrariesToCheck = [
  'H5P.Accordion',
  'H5P.ArithmeticQuiz',
  'H5P.Chart',
  'H5P.Collage',
  'H5P.Column',
  'H5P.CoursePresentation',
  'H5P.Dialogcards',
  'H5P.DocumentationTool',
  'H5P.DragQuestion',
  'H5P.DragText',
  'H5P.Blanks',
  'H5P.ImageHotspotQuestion',
  'H5P.GuessTheAnswer',
  'H5P.InteractiveVideo',
  'H5P.MarkTheWords',
  'H5P.MemoryGame',
  'H5P.MultiChoice',
  'H5P.PersonalityQuiz',
  'H5P.Questionnaire',
  'H5P.QuestionSet',
  'H5P.SingleChoiceSet',
  'H5P.Summary',
  'H5P.Timeline',
  'H5P.TrueFalse'
];

/**
 * Properties that will be checked if they are contained within a single library
 *
 * @type {Array}
 */
const requiredLibraryProperties = [
  'id',
  'version',
  'coreApiVersionNeeded',
  'title',
  'summary',
  'description',
  'createdAt',
  'updatedAt',
  'isRecommended',
  'popularity',
  'screenshots',
  'license',
  'owner',
  'example',
  'keywords'
];

test.beforeEach(async t => {
  const body = new FormData();
  body.append('uuid', 'hello-kitty');

  t.context.data = await fetch('https://api.h5p.org/v1/content-types', {
    method: 'POST',
    body: body
  }).then(data => data.json());
});

test('Content types endpoint should return libraries', t => {
  t.truthy(t.context.data.contentTypes.length);
});

test('Content types endpoint should return libraries with required properties', t => {
  const first = t.context.data.contentTypes[0];
  requiredLibraryProperties.forEach(prop => {
    t.truthy(first[prop] !== undefined);
  });
});

test('Content types libraries should contain core libraries', t => {
  const cts = t.context.data.contentTypes;
  coreLibrariesToCheck.forEach(library => {
    t.truthy(cts.find(ct => ct.id === library));
  });
});
