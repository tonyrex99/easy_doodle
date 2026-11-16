import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Path, G } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { DoodlePath } from '../types/doodle';

interface DoodleThumbnailProps {
  paths: DoodlePath[];
  backgroundColor: string;
  size?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

export function DoodleThumbnail({
  paths,
  backgroundColor,
  size = 44,
  canvasWidth = 360,
  canvasHeight = 600,
}: DoodleThumbnailProps) {
  const isDark = ['#1E293B', '#121214', '#0F172A'].includes(backgroundColor.toUpperCase());

  if (!paths || paths.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { width: size, height: size, backgroundColor },
        ]}
      >
        <Feather name="edit-3" size={Math.round(size * 0.45)} color={isDark ? '#94A3B8' : '#CBD5E1'} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, backgroundColor },
      ]}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      >
        <Rect width={canvasWidth} height={canvasHeight} fill={backgroundColor} />
        <G>
          {paths.map((p) => (
            <Path
              key={p.id}
              d={p.svgPath}
              stroke={p.color === 'transparent' ? backgroundColor : p.color}
              strokeWidth={Math.max(3, p.strokeWidth * 1.2)}
              fill="none"
              opacity={p.opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
});

