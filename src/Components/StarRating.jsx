import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { getIconByName } from "../utilities/icons";
import PropTypes from "prop-types";

const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i} className="cursor-pointer">
            <input
              className="hidden"
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onChange(ratingValue)}
            />
            <FontAwesomeIcon
              icon={getIconByName("star")}
              color={ratingValue <= (hover || value) ? "#ffc107" : "#e4e5e9"}
              size={"xl"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StarRating;
