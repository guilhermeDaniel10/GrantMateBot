import { MessageModel } from '../model/message.model';

export const GREETING: MessageModel = {
  content: `Hi! I'm GrantMate, your project proposal assistant!`,
  id: 'GREETING',
  isFromBot: true,
  expectedMessageId: 'PURPOSE_SELECTION',
};

export const PURPOSE_SELECTION: MessageModel = {
  content: `Can you tell me exactly what you're looking for?`,
  id: 'PURPOSE_SELECTION',
  isFromBot: true,
  dropdownData: [
    {
      value: 'Generate text based on existing topics.',
      valueAsId: 'GENERATE_TEXT_ON_EXISTING_TOPICS',
      expectedMessageId: 'GENERATE_TEXT_ON_EXISTING_TOPICS_MESSAGE',
    },
    {
      value: 'Query topics based on keywords.',
      valueAsId: 'QUERY_TOPICS_BASED_ON_KEYWORDS',
    },
    {
      value: 'Open text.',
      valueAsId: 'OPEN_TEXT',
    },
  ],
  expectedMessageId: 'REQUIRES_USER',
};

export const GENERATE_TEXT_ON_EXISTING_TOPICS_MESSAGE: MessageModel = {
  content: `Generate text based on existing topics.`,
  id: 'GENERATE_TEXT_ON_EXISTING_TOPICS_MESSAGE',
  decisionButtonsData: {
    successValue: 'Submit',
    failureValue: 'Cancel',
    successMessageId: 'TYPE_OF_PROPOSAL_SELECTION',
    failureMessageId: 'PURPOSE_SELECTION',
  },
  isFromBot: false,
  reason: 'CONVERSATION_MOTIVATION',
  expectedMessageId: 'TYPE_OF_PROPOSAL_SELECTION',
};

export const QUERY_TOPICS_BASED_ON_KEYWORDS_MESSAGE: MessageModel = {
  content: `Query topics based on keywords.`,
  id: 'QUERY_TOPICS_BASED_ON_KEYWORDS_MESSAGE',
  isFromBot: false,
  reason: 'CONVERSATION_MOTIVATION',
};

export const OPEN_TEXT_MESSAGE: MessageModel = {
  content: `Open text.`,
  id: 'OPEN_TEXT_MESSAGE',
  isFromBot: false,
  reason: 'CONVERSATION_MOTIVATION',
};

export const TYPE_OF_PROPOSAL_SELECTION: MessageModel = {
  content: `In which type of proposal do you want your text to be generated?`,
  id: 'TYPE_OF_PROPOSAL_SELECTION',
  isFromBot: true,
  dropdownData: [
    {
      value: 'Horizon',
      valueAsId: 'GENERATE_TEXT_HORIZON',
      expectedMessageId: 'HORIZON_SECTION_OPTION',
    },
    {
      value: 'Eurostars',
      valueAsId: 'GENERATE_TEXT_EUROSTARS',
      expectedMessageId: 'EUROSTARS_SECTION_OPTION',
    },
  ],
  expectedMessageId: 'REQUIRES_USER',
};

export const HORIZON_SECTION_OPTION: MessageModel = {
  content: `Horizon`,
  id: 'HORIZON_SECTION_OPTION',
  isFromBot: false,
  decisionButtonsData: {
    successValue: 'Submit',
    failureValue: 'Cancel',
    successMessageId: 'HORIZON_TOPICS_SELECTION',
    failureMessageId: 'TYPE_OF_PROPOSAL_SELECTION',
  },
  expectedMessageId: 'HORIZON_TOPICS_SELECTION',
  reason: 'WANTED_PROPOSAL_TYPE',
};

export const EUROSTARS_SECTION_OPTION: MessageModel = {
  content: `Eurostars`,
  id: 'EUROSTARS_SECTION_OPTION',
  isFromBot: false,
  decisionButtonsData: {
    successValue: 'Submit',
    failureValue: 'Cancel',
    successMessageId: 'EUROSTARS_TOPICS_SELECTION',
    failureMessageId: 'TYPE_OF_PROPOSAL_SELECTION',
  },
  expectedMessageId: 'EUROSTARS_TOPICS_SELECTION',
  reason: 'WANTED_PROPOSAL_TYPE',
};

export const EUROSTARS_TOPICS_SELECTION: MessageModel = {
  content: `In which of this topics to you want your text to be generated?`,
  id: 'EUROSTARS_TOPICS_SELECTION',
  isFromBot: true,
  dropdownData: [
    {
      valueAsId: 'GENERATE_TEXT_SECTION_EUROSTARS_STATEOFART',
      value: 'State-of-the-art',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_EUROSTARS_WHATYOUWANTTODO',
      value: 'What do you want to do',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_EUROSTARS_HOWMAKEMONEY',
      value: 'How will you make money',
    },
  ],

  expectedMessageId: 'INSPIRING_PROPOSAL_INPUT',
};

export const HORIZON_TOPICS_SELECTION: MessageModel = {
  content: `In which of this topics to you want your text to be generated?`,
  id: 'HORIZON_TOPICS_SELECTION',
  isFromBot: true,
  dropdownData: [
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_EXCELLENCE',
      value: 'Excellence',
    },
    { valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_IMPACT', value: 'Impact' },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_IMPLEMENTATION',
      value: 'Implementation',
    },
    { valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_AMBITION', value: 'Ambition' },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_SMARTOBJECTIVES',
      value: 'SMART Objectives',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_GENDERDIMENSIONANDETHICS',
      value: 'Gender Dimensions and Ethics',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_OPENSCIENCE',
      value: 'Open Science',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_DATAMANAGEMENT',
      value: 'Data Management',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_KNOWLEDHEIPTMANAGEMENT',
      value: 'Knowledge, IPR management',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_MEASUREDTOMAXIMISE',
      value: 'Measures to maximise impact',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_TARGETGROUPS',
      value: 'Target Groups and Stakeholder',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_COMMUNICATIONACTIVITIES',
      value: 'Communication activities',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_STANDARTISATIONACTIVITIES',
      value: 'Standartisation activities',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_EXPLOITATION',
      value: 'Exploitation and Commercialisation',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_WORKPLANDESCRIPTION',
      value: 'Workplan Description',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_WORKPLANANDTASKDESCRIPTION',
      value: 'Workplan and taks description',
    },
    {
      valueAsId: 'GENERATE_TEXT_SECTION_HORIZON_CAPACITYCONSORTIUM',
      value: 'Capacity of the consortium',
    },
  ],
  expectedMessageId: 'INSPIRING_PROPOSAL_INPUT',
};

export const INSPIRING_PROPOSAL_INPUT: MessageModel = {
  content: `Do you have any existing proposal in mind that you want your text to be based on? If so, tell me some keywords to find it.`,
  id: 'INSPIRING_PROPOSAL_INPUT',
  isFromBot: true,
  openField: true,
};

export const KEYWORD_SEARCH_MESSAGE: MessageModel = {
  content: `Alright! This is what I found about the type of proposal <b>{PROPOSAL_TYPE}</b>, regarding the topic <b>{TOPIC}</b> with the keywords <b>{KEYWORDS}</b>.`,
  id: 'KEYWORD_SEARCH_MESSAGE',
  isFromBot: true,
  expectedMessageId: 'TOP_K_SEARCH_SERVICE_CALL',
};

export const TOP_K_SEARCH_SERVICE_CALL: MessageModel = {
  content: ``,
  id: 'TOP_K_SEARCH_SERVICE_CALL',
  isFromBot: true,
  serviceCall: {
    endpoint: 'TOP_K_SEARCH',
  },
};

export const CUSTOM_USER_MESSAGE: MessageModel = {
  content: `Custom message`,
  id: 'CUSTOM_MESSAGE',
  isFromBot: false,
  expectedMessageId: 'REQUIRES_USER',
};

export const ALL_MESSAGES: MessageModel[] = [
  GREETING,
  PURPOSE_SELECTION,
  GENERATE_TEXT_ON_EXISTING_TOPICS_MESSAGE,
  QUERY_TOPICS_BASED_ON_KEYWORDS_MESSAGE,
  OPEN_TEXT_MESSAGE,
  TYPE_OF_PROPOSAL_SELECTION,
  HORIZON_SECTION_OPTION,
  EUROSTARS_SECTION_OPTION,
  EUROSTARS_TOPICS_SELECTION,
  HORIZON_TOPICS_SELECTION,
  INSPIRING_PROPOSAL_INPUT,
  CUSTOM_USER_MESSAGE,
  TOP_K_SEARCH_SERVICE_CALL,
];
