import { motion } from "framer-motion";
import TrainingCard from "./TrainingCard";

export default function TrainingGrid({ trainings = [], onTrainingClick }) {
  // Add validation for trainings array
  if (!Array.isArray(trainings)) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {trainings.map((training, index) => (
        training && ( // Only render if training exists
          <TrainingCard
            key={training?.trainingId || training?._id || index}
            training={training}
            index={index}
            onTrainingClick={onTrainingClick}
          />
        )
      ))}
    </div>
  );
}