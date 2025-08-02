import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Ticket interface

export interface TicketAnswerI {
  lotin: string;
  rus: string;
  krill: string;
}

export interface TicketI {
  _id: string;
  imgUrl: string;
  questions: {
    lotin: string;
    rus: string;
    krill: string;
  };
  answers: TicketAnswerI[];
  correct_answer: number;
  izoh: {
    lotin: string;
    rus: string;
    krill: string;
  };
}

export interface BigTicketI {
  children: TicketI[];
  id: number;
}

// Ticket answers interface

export interface TicketTestAnswerI {
  questionId: number;
  correct_answer: number;
}

export interface TicketAnswersI {
  ticketId: number;
  answers: TicketTestAnswerI[];
  used: number;
  rejected: number;
}

// Marathon interface

export interface MarathonQuestionI {
  id: number;
  imgUrl: string;
  questions: {
    lotin: string;
    rus: string;
    krill: string;
  };
  answers: TicketAnswerI[];
  correct_answer: number;
  izoh: {
    lotin: string;
    rus: string;
    krill: string;
  };
}

export interface MarathonAnswersI {
  questionId: number;
  correct_answer: number;
}

export interface MarathonI {
  answers: MarathonAnswersI[];
  used: number;
  rejected: number;
  questions: MarathonQuestionI[];
  isFinished: boolean;
  id: number;
}

// Home test

export interface HomeQuestionI {
  id: number;
  imgUrl: string;
  questions: {
    lotin: string;
    rus: string;
    krill: string;
  };
  answers: TicketAnswerI[];
  correct_answer: number;
  izoh: {
    lotin: string;
    rus: string;
    krill: string;
  };
}

export interface HomeAnswersI {
  questionId: number;
  correct_answer: number;
}

export interface HomeTestI {
  answers: HomeAnswersI[];
  used: number;
  rejected: number;
  questions: HomeQuestionI[];
  limit: number;
}

// Main interface

export interface MainTicketI {
  tickets: BigTicketI[];
  answers: TicketAnswersI[];
  marathon: MarathonI[];
  home_test: HomeTestI;
}

const initialState: MainTicketI = {
  tickets: [],
  answers: [],
  marathon: [],
  home_test: {
    answers: [],
    used: 0,
    rejected: 0,
    questions: [],
    limit: 10,
  },
};

const TicketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setTickets: (state, { payload }) => {
      const result: any[] = [];
      const n = 10;
      let id = 0;

      for (let i = 0; i <= payload.tickets.length; i += n) {
        id++;
        result.push({ children: payload.tickets.slice(i, i + n), id: id });
      }
      return {
        tickets: result.filter((i) => i.children.length),
        answers: payload.answers,
        marathon: payload.marathon,
        home_test: state.home_test,
      };
    },
    addNewAnswerTicket: (
      state,
      action: PayloadAction<{ ticketId: number }>
    ) => {
      const { ticketId } = action.payload;

      const foundIndex = state.answers.findIndex(
        (i) => i.ticketId === ticketId
      );

      if (foundIndex !== -1) {
        state.answers[foundIndex] = {
          ticketId,
          answers: [],
          used: 0,
          rejected: 0,
        };
      } else {
        state.answers.push({
          ticketId,
          answers: [],
          used: 0,
          rejected: 0,
        });
      }

      return state;
    },
    addNewAnswerTicketTest: (
      state,
      action: PayloadAction<{
        ticketId: number;
        questionId: number;
        correct_answer: number;
      }>
    ) => {
      const { ticketId, questionId, correct_answer } = action.payload;

      const relatedTicket = state.tickets[ticketId]?.children?.[questionId];
      if (!relatedTicket) return state;

      const isCorrect = relatedTicket.correct_answer === correct_answer;

      return {
        ...state,
        answers: state.answers.map((item) => {
          if (item.ticketId === ticketId) {
            const existingIndex = item.answers.findIndex(
              (a) => a.questionId === questionId
            );

            let updatedAnswers = [...item.answers];
            let used = item.used;
            let rejected = item.rejected;

            if (existingIndex >= 0) {
              const prev = item.answers[existingIndex];
              const prevCorrect =
                state.tickets[ticketId]?.children?.[prev.questionId]
                  ?.correct_answer === prev.correct_answer;

              if (prevCorrect && !isCorrect) {
                used -= 1;
                rejected += 1;
              } else if (!prevCorrect && isCorrect) {
                used += 1;
                rejected -= 1;
              }

              updatedAnswers[existingIndex] = {
                questionId,
                correct_answer,
              };
            } else {
              updatedAnswers.push({ questionId, correct_answer });
              if (isCorrect) used += 1;
              else rejected += 1;
            }

            return {
              ...item,
              answers: updatedAnswers,
              used,
              rejected,
            };
          }
          return item;
        }),
      };
    },
    addMarathonTest: (state, _) => {
      let n = 0;
      const shuffleArray = state.tickets.flatMap(() => {
        const randomNumber = Math.floor(Math.random() * state.tickets.length);
        return state.tickets[randomNumber].children.map((child) => ({
          ...child,
          id: ++n,
        }));
      });

      state.marathon.push({
        answers: [],
        used: 0,
        rejected: 0,
        questions: shuffleArray.slice(0, 20),
        isFinished: false,
        id: state.marathon.length + 1,
      });
      return state;
    },
    answerTheQuestionMarathon: (
      state,
      action: PayloadAction<{ marathonId: number; answer: MarathonAnswersI }>
    ) => {
      const { marathonId, answer } = action.payload;

      const marathon = state.marathon.find((m) => m.id === marathonId);
      if (!marathon) {
        console.warn(`Marathon not found: id=${marathonId}`);
        return state;
      }

      const { questionId, correct_answer } = answer;

      const question = marathon.questions.find((q) => q.id === questionId);
      if (!question) {
        console.warn("Question not found in marathon");
        return state;
      }

      const isCorrect = question.correct_answer === correct_answer;

      const existingIndex = marathon.answers.findIndex(
        (i) => i.questionId === questionId
      );

      if (existingIndex !== -1) {
        const prevAnswer = marathon.answers[existingIndex];
        const wasCorrect =
          question.correct_answer === prevAnswer.correct_answer;

        if (wasCorrect && !isCorrect) {
          marathon.used = Math.max(0, marathon.used - 1);
          marathon.rejected += 1;
        } else if (!wasCorrect && isCorrect) {
          marathon.used += 1;
          marathon.rejected = Math.max(0, marathon.rejected - 1);
        }

        marathon.answers[existingIndex] = answer;
      } else {
        marathon.answers.push(answer);
        if (isCorrect) {
          marathon.used += 1;
        } else {
          marathon.rejected += 1;
        }
      }

      return state;
    },

    finishedtheMarathon: (
      state,
      { payload }: PayloadAction<{ marathonId: number }>
    ) => {
      state.marathon = state.marathon.map((i) => {
        if (i.id === payload.marathonId) {
          return { ...i, isFinished: true };
        }
        return i;
      });
      return state;
    },
    setHomeTest: (state, { payload }: PayloadAction<{ limit: number }>) => {
      let n = 0;
      const shuffleArray = state.tickets.flatMap(() => {
        const randomNumber = Math.floor(Math.random() * state.tickets.length);
        return state.tickets[randomNumber].children.map((child) => ({
          ...child,
          id: ++n,
        }));
      });
      state.home_test.limit = payload.limit;
      state.home_test.questions = shuffleArray.slice(0, payload.limit);
      state.home_test.answers = [];
      state.home_test.used = 0;
      state.home_test.rejected = 0;
      return state;
    },
    answerToHomeTest: (
      state,
      { payload }: PayloadAction<{ answer: HomeAnswersI }>
    ) => {
      state.home_test.answers.push(payload.answer);
      const ticket = state.home_test.questions.find(
        (i) => i.id == payload.answer.questionId
      );
      if (!ticket) {
        console.warn("ticket not found");
      }

      if (ticket?.correct_answer === payload.answer.correct_answer) {
        state.home_test.used += 1;
      } else {
        state.home_test.rejected += 1;
      }
      return state;
    },
  },
});

export const {
  setTickets,
  addNewAnswerTicket,
  addNewAnswerTicketTest,
  addMarathonTest,
  answerTheQuestionMarathon,
  setHomeTest,
  answerToHomeTest,
  finishedtheMarathon,
} = TicketSlice.actions;
export default TicketSlice.reducer;
