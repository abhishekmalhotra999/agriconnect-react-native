# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.infer.annotation.** { *; }

# SoLoader - Required for 16KB page size support
-keep class com.facebook.soloader.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keepclassmembers class * {
    @com.facebook.jni.JniMethod *;
}

# Keep your model classes or anything used via reflection (add as needed)
