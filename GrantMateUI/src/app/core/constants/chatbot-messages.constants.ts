export const CHATBOT_MESSAGES = {
  INITIAL_MESSAGE: `Hi! I'm GrantMate, your project proposal assistant!`,
  STARTUP_SELECT_MESSAGE: `Can you tell me exactly what you're looking for?`,
  STARTUP_SELECT_OPTIONS: {
    GENERATE_TEXT: `Generate text based on existing topics.`,
    QUERY_TOPICS: `Query topics based on keywords.`,
    OPEN_TEXT: `Open text.`,
  },
  GENERATE_TEXT_SELECT_MESSAGE: `In which type of proposal do you want your text to be generated?`,
  GENERATE_TEXT_SELECT_OPTIONS: [
    { valueAsId: `GENERATE_TEXT_HORIZON`, value: `Horizon` },
    { valueAsId: `GENERATE_TEXT_EUROSTARS`, value: `Eurostars` },
  ],
  GENERATE_TEXT_HORIZON_SELECT_MESSAGE: `In which of this topics to you want your text to be generated?`,
  GENERATE_TEXT_HORIZON_SELECT_OPTIONS: [
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
  GENERATE_TEXT_EUROSTARS_SELECT_MESSAGE: `In which of this topics to you want your text to be generated?`,
  GENERATE_TEXT_EUROSTARS_SELECT_OPTIONS: [
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
};
