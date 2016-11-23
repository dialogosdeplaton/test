using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using SocketIO;
using System;


public class Controller : MonoBehaviour {

	public SocketIOComponent socket;
	public string[] global_screen_names;
	public string[] global_profile_images;

	void Start () {
		StartCoroutine(ConnectToServer());
		socket.On ("USER_CONNECTED",OnUserConnected);
		socket.On ("getFollowersList", OnGetFollowersList);
	}

	IEnumerator ConnectToServer(){
		yield return new WaitForSeconds(0f);
		socket.Emit("USER_CONNECT");
		yield return new WaitForSeconds (0f);
		socket.Emit("getFollowersList");
	}

	private void OnGetFollowersList(SocketIOEvent obj ){


		string[] screen_names = Regex.Split(obj.data.GetField("screen_names_list").ToString(), ",");
		string[] profile_images = Regex.Split(obj.data.GetField("profile_images_list").ToString(), ",");

		for(int i = 0; i < screen_names.Length; i++){
			screen_names [i] = Regex.Replace (screen_names.GetValue(i).ToString(), "[\\[\\]]", "");
			Debug.Log ("screen_name de: " + i + " " + screen_names[i]); 
			profile_images[i] = Regex.Replace (profile_images.GetValue(i).ToString(), "[\\[\\]]", "");
			Debug.Log("profile_image de: "+ i + " " + profile_images[i]);
		}

		global_screen_names = screen_names;
		global_profile_images = profile_images;
	}

	private void OnUserConnected(SocketIOEvent evt){
		Debug.Log ("Get the message from server is: "+evt.data+"OnUserConnected");
	}


}

