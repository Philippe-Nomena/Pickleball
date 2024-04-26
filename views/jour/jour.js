import React from "react";
import { withExpoSnack } from "nativewind";

import { Pressable, Text } from "react-native";
import { styled, useColorScheme } from "nativewind";

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

function Jour() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <StyledPressable
      onPress={toggleColorScheme}
      className="flex-1 items-center justify-center dark:bg-slate-800"
    >
      <StyledText selectable={false} className="dark:text-white">
        {`Try clicking me! ${colorScheme === "dark" ? "🌙" : "🌞"}`}
      </StyledText>
    </StyledPressable>
  );
}

export default withExpoSnack(Jour);
