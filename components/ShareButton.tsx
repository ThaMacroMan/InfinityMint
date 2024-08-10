import React from "react";
import { motion } from "framer-motion";
import { addPropertyControls, ControlType } from "framer";
import { IconContext } from "react-icons";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

interface ShareButtonProps {
  socialMedia: string;
  shareText: string;
  iconProperties: {
    color: string;
    size: number;
    gap: number;
  };
  backgroundType: string;
  title: string;
  tint: string;
  style: React.CSSProperties;
  font: {
    size: number;
    weight: string;
    color: string;
    fontFace: string;
  };
  borderWidth: number;
  borderColor: string;
  shareCurrentUrl: boolean;
  urlToShare?: string;
  backgroundImage?: string;
  linear?: {
    degree: number;
    toColor: string;
    fromColor: string;
    opacityTo: number;
    opacityFrom: number;
  };
  radius: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomRightRadius: number;
  bottomLeftRadius: number;
  isMixedRadius?: boolean;
  stylePadding: number;
  topPadding: number;
  rightPadding: number;
  bottomPadding: number;
  leftPadding: number;
  isMixedPadding?: boolean;
  image?: string; // New prop to pass the image base64 data
}

const onHoverStyle = {
  scale: 1.05,
  cursor: "pointer",
};

const spring = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const {
    socialMedia,
    shareText,
    iconProperties,
    backgroundType,
    title,
    tint,
    style,
    font,
    borderWidth,
    borderColor,
    shareCurrentUrl,
    urlToShare,
    backgroundImage,
    linear,
    radius,
    topLeftRadius,
    topRightRadius,
    bottomRightRadius,
    bottomLeftRadius,
    isMixedRadius = false,
    stylePadding,
    topPadding,
    rightPadding,
    bottomPadding,
    leftPadding,
    isMixedPadding = false,
    image,
  } = props;

  const borderRadius = isMixedRadius
    ? `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`
    : `${radius}px`;

  const padding = isMixedPadding
    ? `${topPadding}px ${rightPadding}px ${bottomPadding}px ${leftPadding}px`
    : `${stylePadding}px`;

  let background;
  if (backgroundType === "Solid") {
    background = tint;
  } else if (backgroundType === "Image") {
    background = `url(${backgroundImage})`;
  } else if (backgroundType === "Linear" && linear) {
    const { degree, toColor, fromColor, opacityTo, opacityFrom } = linear;
    const gradient = `${degree}deg, ${toColor} ${opacityTo}%, ${fromColor} ${opacityFrom}%`;
    background = `linear-gradient(${gradient})`;
  }

  const shareOnTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlToShare || window.location.href)}&text=${encodeURIComponent(shareText)}&hashtags=infinitymint&via=your_twitter_handle&media=${encodeURIComponent(image || '')}`;
    window.open(twitterShareUrl, "_blank");
  };

  let Icon;
  if (socialMedia === "Twitter") {
    Icon = <FaTwitter style={{ color: iconProperties.color, fontSize: iconProperties.size }} />;
  } else if (socialMedia === "LinkedIn") {
    Icon = <FaLinkedin style={{ color: iconProperties.color, fontSize: iconProperties.size }} />;
  } else if (socialMedia === "Facebook") {
    Icon = <FaFacebook style={{ color: iconProperties.color, fontSize: iconProperties.size }} />;
  }

  return (
    <motion.div
      style={{ ...style, ...containerStyle }}
      onClick={shareOnTwitter}
    >
      <motion.div
        style={{
          borderRadius,
          padding,
          background,
          fontSize: font.size,
          fontWeight: font.weight,
          color: font.color,
          fontFamily: `'${font.fontFace}'`,
          overflow: "visible",
          borderWidth: borderWidth,
          borderStyle: "solid",
          borderColor: borderColor,
          display: "flex",
          alignItems: "center",
          gap: iconProperties.gap,
        }}
        whileHover={onHoverStyle}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <IconContext.Provider value={{ color: iconProperties.color, size: `${iconProperties.size}px` }}>
          {Icon}
        </IconContext.Provider>
        {title}
      </motion.div>
    </motion.div>
  );
};

addPropertyControls(ShareButton, {
  shareCurrentUrl: {
    type: ControlType.Boolean,
    defaultValue: true,
  },
  urlToShare: {
    type: ControlType.String,
    defaultValue: "infinitymint.io",
    hidden(props) {
      return props.shareCurrentUrl !== false;
    },
  },
  socialMedia: {
    type: ControlType.Enum,
    options: ["Twitter", "Facebook", "LinkedIn"],
  },
  shareText: {
    type: ControlType.String,
    defaultValue: "Share on Twitter: ",
    description: "Additional text is only available for Twitter sharing.",
    hidden(props) {
      return props.socialMedia !== "Twitter";
    },
  },
  iconProperties: {
    type: ControlType.Object,
    controls: {
      color: { type: ControlType.Color, defaultValue: "#fff" },
      size: { type: ControlType.Number, defaultValue: 20 },
      gap: { type: ControlType.Number, defaultValue: 10 },
    },
  },
  title: {
    title: "Label",
    type: ControlType.String,
    defaultValue: "Share on X",
  },
  backgroundType: {
    type: ControlType.Enum,
    options: ["Solid", "Linear", "Image"],
    defaultValue: "Solid",
  },
  backgroundImage: {
    type: ControlType.Image,
    hidden(props) {
      return props.backgroundType !== "Image";
    },
  },
  linear: {
    type: ControlType.Object,
    controls: {
      toColor: { type: ControlType.Color, defaultValue: "#242424" },
      opacityTo: { type: ControlType.Number, defaultValue: 0 },
      fromColor: { type: ControlType.Color, defaultValue: "#323232" },
      opacityFrom: { type: ControlType.Number, defaultValue: 100 },
      degree: { type: ControlType.Number, defaultValue: 90, max: 360 },
    },
    hidden(props) {
      return props.backgroundType !== "Linear";
    },
  },
  tint: {
    title: "Background Color",
    type: ControlType.Color,
    defaultValue: "#131415",
    hidden(props) {
      return props.backgroundType !== "Solid";
    },
  },
  font: {
    type: ControlType.Object,
    controls: {
      fontFace: {
        type: ControlType.String,
        defaultValue: "Inter",
      },
      size: { type: ControlType.Number, defaultValue: 16 },
      color: { type: ControlType.Color, defaultValue: "#fff" },
      weight: {
        type: ControlType.Enum,
        defaultValue: "bold",
        options: ["normal", "bold", "bolder", "lighter"],
      },
    },
  },
  radius: {
    type: ControlType.FusedNumber,
    title: "Radius",
    defaultValue: 4,
    toggleKey: "isMixedRadius",
    toggleTitles: ["All", "Individual"],
    valueKeys: [
      "topLeftRadius",
      "topRightRadius",
      "bottomRightRadius",
      "bottomLeftRadius",
    ],
    valueLabels: ["TL", "TR", "BR", "BL"],
    min: 0,
  },
  borderWidth: {
    type: ControlType.Number,
    defaultValue: 1,
  },
  borderColor: {
    type: ControlType.Color,
    defaultValue: "#222426",
  },
  stylePadding: {
    type: ControlType.FusedNumber,
    title: "Padding",
    defaultValue: 16,
    toggleKey: "isMixedPadding",
    toggleTitles: ["All", "Individual"],
    valueKeys: [
      "topPadding",
      "rightPadding",
      "bottomPadding",
      "leftPadding",
    ],
    valueLabels: ["T", "R", "B", "L"],
    min: 0,
  },
});

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "visible",
};

export default ShareButton;
