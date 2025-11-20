import { useState, useEffect } from 'react'
import Layout from './components/Layout/Layout'
import './App.css'

function App() {
  const [countryCapitalMap, setCountryCapitalMap] = useState(null)
  const [capitalsArray, setCapitalsArray] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital')
        const result = await response.json()
        const cityObject = {
        }
        const arrayOfCapitals = []
        result.map((country) => {
          if (country.capital && country.capital.length > 0) {
            cityObject[country.name.common] = country.capital[0]
            arrayOfCapitals.push(country.capital[0])
          }
        })
        setCountryCapitalMap(cityObject) // countries and capitals map
        setCapitalsArray(arrayOfCapitals) // array of capitals
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const generateQuestion = () => {
    const countries = Object.keys(countryCapitalMap); // get all country names (keys of the map)
    const randomCountry = countries[Math.floor(Math.random() * countries.length)]; // select a random country
    const correctCapital = countryCapitalMap[randomCountry]; // get the correct capital for that country

  // Generate 3 random incorrect options
  const incorrectCapitals = capitalsArray.filter((capital) => capital !== correctCapital);
  const shuffledIncorrect = incorrectCapitals.sort(() => Math.random() - 0.5);
  const incorrectOptions = shuffledIncorrect.slice(0, 3);

  // Combine correct answer with incorrect options
  const options = [correctCapital, ...incorrectOptions];

  // Shuffle the options array
  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  // Set the current question
  setCurrentQuestion({
    question: `What is the capital of ${randomCountry}?`,
    options: shuffledOptions,
    correctAnswer: correctCapital,
  });
  }

  const handleAnswerSelection = (selectedOption) => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1); // Increment score for correct answer
    }
    generateQuestion(); // Generate a new question after answering
  }

  const isGameOver = () => {
    if (score >= 10) {
      return true;
    }
    return false; // Placeholder
  }


  return (
    <>
     <Layout>
      <div className="absolute right-4 text-2xl font-bold">
        Score: {score}
      </div>
      <button 
        onClick={generateQuestion}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Generate Question
      </button>
      {currentQuestion && (
          <div className="mt-6 p-4 border rounded-lg shadow-sm w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
            <ul className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <li 
                  key={index} 
                  className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAnswerSelection(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
            {isGameOver() && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Congratulations! You've reached a score of 10!
              </div>
            )}
          </div>
        )}
     </Layout>
    </>
  )
}

export default App
