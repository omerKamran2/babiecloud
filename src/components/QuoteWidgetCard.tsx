// src/components/QuoteWidgetCard.tsx
import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface QuoteWidgetCardProps {
  onLongPress?: () => void;
}

// Array of positive parenting and relationship quotes
const QUOTES = [
  {
    text: "Children are not a distraction from more important work. They are the most important work.",
    author: "C.S. Lewis"
  },
  {
    text: "The way we talk to our children becomes their inner voice.",
    author: "Peggy O'Mara"
  },
  {
    text: "Your kids require you most of all to love them for who they are, not to spend your whole time trying to correct them.",
    author: "Bill Ayers"
  },
  {
    text: "The best way to make children good is to make them happy.",
    author: "Oscar Wilde"
  },
  {
    text: "A baby is born with a need to be loved and never outgrows it.",
    author: "Frank A. Clark"
  },
  {
    text: "There are places in the heart you don't even know exist until you love a child.",
    author: "Anne Lamott"
  },
  {
    text: "Having a baby is like falling in love again, both with your husband and your child.",
    author: "Tina Brown"
  },
  {
    text: "Love is the one thing we can never have enough of.",
    author: "Unknown"
  }
];

const QuoteWidgetCard: React.FC<QuoteWidgetCardProps> = ({ onLongPress }) => {
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();
  
  // Select a random quote on component mount (using useMemo to prevent re-render changes)
  const { text, author } = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[randomIndex];
  }, []);
  
  const handlePress = () => {
    // @ts-ignore - We'll assume the navigation types will be fixed later
    navigation.navigate('Quotes');
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Quote: ${text} by ${author}`}
    >
      <View style={styles.contentContainer}>
        <Ionicons 
          name="chatbubble-ellipses-outline" 
          size={26} 
          color={isDark ? '#aaa' : '#666'} 
          style={styles.icon}
        />
        <Text style={[styles.quoteText, { color: isDark ? '#fff' : '#000' }]}>
          "{text}"
        </Text>
        <Text style={[styles.authorText, { color: isDark ? '#aaa' : '#666' }]}>
          — {author}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  authorText: {
    fontSize: 14,
    textAlign: 'right',
    alignSelf: 'flex-end',
  }
});

export default QuoteWidgetCard;
