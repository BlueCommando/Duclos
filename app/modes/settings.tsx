import { createSettingsStyle } from '@/assets/styles/modes/settings.style'
import AiService from '@/components/ai/AiService'
import ChangeAiModel from '@/components/settings/ChangeAiModel'
import CheckBox from '@/components/settings/CheckBox'
import DeleteAllChats from '@/components/settings/DeleteAllChats'
import { useSettingsStore } from '@/components/userData/UserSettings'
import useTheme from '@/hooks/useTheme'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const settings = () => {
  const theme = useTheme();
  const stylesheet = createSettingsStyle(theme);

  const settingsStore = useSettingsStore.getState();

  const [prePromptedText, changePrePromptedText] = useState(settingsStore.settings.prepromptedMessage || "");

  const aiModelInfo = AiService.getAiModelInfo();

  if (!settingsStore.loaded) return <View/>;

  return (
    <>
      <View style={stylesheet.background}/>

      <SafeAreaView edges={["top"]}>
        <ScrollView>
          <View style={stylesheet.innerScrollView}>

            {/*User Pre-prompt*/}
            <View style={[stylesheet.basicSettingBox, stylesheet.columnSettingBox]}>
              <Text style={stylesheet.headerText}>Pre-prompted Message</Text>
              <Text style={stylesheet.text}>
                Prompts the typed message towards the AI on every prompt you do.
              </Text>
              <TextInput 
                multiline={true}
                submitBehavior="blurAndSubmit"
                placeholder="Click to type a Pre-prompted Message to AI"
                placeholderTextColor={theme.textPlaceholderColor}
                style={stylesheet.inputBox}
                onChangeText={changePrePromptedText}
                value={prePromptedText}
                onBlur={() => 
                  settingsStore.saveUserSettings({
                    ...settingsStore.settings,
                    prepromptedMessage: prePromptedText !== "" && prePromptedText || undefined,
                  })
                }
              />
            </View>

            {/*AI Model (NOT A FEATURE YET)*/}
            <View style={[stylesheet.basicSettingBox, stylesheet.columnSettingBox]}>
              <Text style={stylesheet.headerText}>AI Model</Text>
              <TouchableOpacity 
                style={stylesheet.basicInnerBox}
                onPress={ChangeAiModel}
              >
                <Text style={stylesheet.nonEditableText}>
                  {`AI Model:\n${aiModelInfo.aiModelName}\n\nMMProj Model:\n${aiModelInfo.mmprojModelMame}`}
                </Text>
              </TouchableOpacity>
            </View>

            {/*Conversation Context*/}
            <View style={stylesheet.basicSettingBox}>
              <CheckBox
                initCheck={settingsStore.settings.conversationContext}
                onPressed={(b) => settingsStore.saveUserSettings({
                  ...settingsStore.settings,
                  conversationContext: b,
                })}
              />
              
              <View style={{maxWidth: "80%"}}>
                <Text style={stylesheet.headerText}>Conversation Context</Text>
                <Text style={stylesheet.text}>{
                  `AI re-reads the past 10 messages between you and the AI.\n(Does not re-read images.)`
                }</Text>
              </View>
            </View>

            {/*System Completion*/}
            <View style={stylesheet.basicSettingBox}>
              <CheckBox
                initCheck={settingsStore.settings.systemCompletion}
                onPressed={(b) => settingsStore.saveUserSettings({
                  ...settingsStore.settings,
                  systemCompletion: b,
                })}
              />
              
              <View style={{maxWidth: "80%"}}>
                <Text style={stylesheet.headerText}>System Completion</Text>
                <Text style={stylesheet.text}>
                  Prompts the AI with coded-in system instructions 
                  that tell the AI to structure their response and have self-awareness. 
                  If Disabled the user has full control of input to the AI.
                </Text>
              </View>
            </View>

            {/*Delete all chats*/}
            <TouchableOpacity onPress={DeleteAllChats} style={stylesheet.basicSettingBox}>
              <View style={stylesheet.smallImageView}>
                <Image style={stylesheet.fitImage} source={require("@/assets/app/PLACEHOLDER.png")}/>
              </View>

              <Text style={stylesheet.redText}>Delete ALL Chats</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default settings
