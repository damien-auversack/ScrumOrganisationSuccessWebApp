import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserStory} from "../../../domain/user-story";
import {UserStoriesService} from "../../../services/user-stories/user-stories.service";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {CommentsService} from "../../../services/comments/comments.service";
import {SosComment} from "../../../domain/sos-comment";
import {DatePipe} from "@angular/common";
import {SosUser} from "../../../domain/sos-user";
import {UserService} from "../../../services";

interface CommentUser {
    comment:SosComment,
    user:SosUser
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['../../../app.component.css', './comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;
    isBackButtonPressed: boolean = false;
    projectName: string | null = "";
    idProject: number = 0;

    tmp:CommentUser = {
        comment:null!,
        user:null!
    }

    actualUserStory:UserStory = {
        description: "", idProject: 0, name: "", priority: 0
    };
    currentUser:SosUser=null!;
    idActualUserStory:number=0;

    addContent:string = "";

    commentUser:CommentUser[] = [];
    usersComment:SosUser[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private userStoriesService:UserStoriesService,
              private commentsService:CommentsService,
              private userService:UserService) { }


    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

  ngOnInit(): void {
      this.commentUser=[];
      this.usersComment = [];
      this.projectName = this.activatedRoute.snapshot.paramMap.get("projectName");
      this.currentUser = <SosUser>JSON.parse(<string>localStorage.getItem('currentUser'));
      this.idActualUserStory = Number(this.activatedRoute.snapshot.paramMap.get("idUserStory"));
      this.fillActualUserStory();
  }

  // Get Actual User Story
  private fillActualUserStory() {
      this.commentUser=[];
      this.subscription = this.userStoriesService.getById(this.idActualUserStory)
          .pipe(
              map(userStories => {
                  this.actualUserStory = userStories;
                  this.idProject = userStories.idProject;
                  this.subscription = this.fillUsersComment().pipe(map(()=>{this.fillComments();})).subscribe();
              })
          ).subscribe()
  }

  // Get comments from a specific user story
  private fillComments() {
      this.subscription = this.commentsService.getByIdUserStory(this.idActualUserStory)
          .pipe(
              map(commentsTmp => {

                  // Fetch users who commented User Stories and add it to a vector
                  this.fillUsersComment();

                  // Browse all comments and for each
                    // Browse through the users who have commented and add the comment and user value to the final COMMENT - USER vector
                  for (let elt of commentsTmp) {
                      this.fillCommentUser(elt.idUser,elt)
                  }
              })
          ).subscribe()
  }

  // Modify the date format
  formatDate(date:Date):string {
      let datepipe = new DatePipe('en-US');
      let latest_date =datepipe.transform(date, 'dd/MM/yyyy | HH:mm:ss');
      return latest_date!;
  }

    addComment() {
      // Return if empty
      if(this.addContent==""){
          return;
      }

      //initialize empty comment
        let addcomment = {
            content: "",
            idUser: 0,
            idUserStory: 0,
            postedAt: new Date()
        };

        // Get the date and format it
        let datepipe = new DatePipe('en-US');
        let latest_date =datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        let date = new Date(latest_date!);

        // Set the content of the comment
        addcomment.content = this.addContent;
        addcomment.idUser = this.currentUser.id!;
        addcomment.idUserStory = this.idActualUserStory;
        addcomment.postedAt = date;

        this.commentsService.addComment(addcomment).pipe(map(()=>{
            this.commentUser.push({ comment:addcomment,
                                    user:this.currentUser});
            let notCommentedYet = true;
            for(let elt of this.usersComment){
                if(elt.id==this.currentUser.id)notCommentedYet=false
            }
            if(notCommentedYet)this.usersComment.push(this.currentUser);

        })).subscribe();

        this.addContent = "";

    }

    // Fetch users who commented User Stories and add it to a vector
    fillUsersComment() {
        return this.userService.getByCommentOnUserStory(this.idActualUserStory)
            .pipe(
                map(users => {
                    this.usersComment = [];
                    for (let elt of users) {
                        this.usersComment.push(elt);
                    }
                })
            )
    }

    // Browse the users who have commented and add the comment and user value to the final vector COMMENT - USER
    fillCommentUser(idUser:number, comment:SosComment) {
      for (let elt of this.usersComment) {
          if (idUser == elt.id) {
              this.tmp = {
                  comment:comment,
                  user:elt
              }
              this.commentUser.push(this.tmp);
          }
      }
    }

    toggleBackButtonPress(isPressed: boolean) {
        this.isBackButtonPressed = isPressed;
    }
}
