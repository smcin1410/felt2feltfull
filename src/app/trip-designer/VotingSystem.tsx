import React, { useState } from 'react';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: { [option: string]: number };
}

const VotingSystem: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [question, setQuestion] = useState('');
  const [optionInput, setOptionInput] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const handleAddOption = () => {
    if (optionInput && !options.includes(optionInput)) {
      setOptions([...options, optionInput]);
      setOptionInput('');
    }
  };

  const handleCreatePoll = () => {
    if (!question || options.length < 2) return;
    setPolls([
      ...polls,
      {
        id: 'poll-' + Date.now(),
        question,
        options,
        votes: options.reduce((acc, opt) => ({ ...acc, [opt]: 0 }), {}),
      },
    ]);
    setQuestion('');
    setOptions([]);
  };

  const handleVote = (pollId: string, option: string) => {
    setPolls(
      polls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              votes: {
                ...poll.votes,
                [option]: (poll.votes[option] || 0) + 1,
              },
            }
          : poll
      )
    );
  };

  return (
    <div className="border border-gray-700 rounded-xl p-4 mb-6 bg-gray-900/80 text-gray-100">
      <h3 className="text-lg font-semibold mb-2">Group Voting</h3>
      <div className="mb-4">
        <h4 className="font-semibold mb-1">Create a Poll</h4>
        <label className="block mb-1">
          Question:
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white w-52"
          />
        </label>
        <label className="block mb-1">
          Add Option:
          <input
            type="text"
            value={optionInput}
            onChange={e => setOptionInput(e.target.value)}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white w-32"
          />
          <button className="ml-2 px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={handleAddOption}>
            Add Option
          </button>
        </label>
        <div className="mt-2">
          {options.map((opt, idx) => (
            <span key={idx} className="inline-block bg-gray-800 text-gray-200 px-2 py-1 rounded mr-2 mb-1 text-xs">{opt}</span>
          ))}
        </div>
        <button className="mt-2 px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm" onClick={handleCreatePoll}>
          Create Poll
        </button>
      </div>
      <div>
        <h4 className="font-semibold mb-1">Active Polls</h4>
        {polls.length === 0 && <p className="text-gray-400">No polls yet.</p>}
        {polls.map((poll) => (
          <div key={poll.id} className="mb-4 p-2 border border-gray-600 rounded bg-gray-800">
            <strong className="text-gray-100">{poll.question}</strong>
            <ul>
              {poll.options.map((opt) => (
                <li key={opt} className="flex items-center mb-1">
                  <span className="text-gray-200">{opt}</span> <span className="ml-2 text-xs text-gray-400">Votes: {poll.votes[opt]}</span>
                  <button className="ml-2 px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={() => handleVote(poll.id, opt)}>
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingSystem; 