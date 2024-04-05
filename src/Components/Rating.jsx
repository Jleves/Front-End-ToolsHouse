import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";

const Rating = ({ rating = 0 }) => {
  return (
    <div className="flex flex-row">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <div key={"star-" + ratingValue}>
            <FontAwesomeIcon
              icon={getIconByName("star")}
              color={ratingValue <= rating ? "#3C48B9" : "#e4e5e9"}
              size={"sm"}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
