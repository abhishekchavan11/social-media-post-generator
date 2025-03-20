import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { PromptService } from '../service/prompt.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  myForm!: FormGroup;
  loaderFlag: boolean = false;
  submitFlag !: boolean;
  approvedPosts: any[] = [];
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  };
  posts: any = {};
  constructor(private fb: FormBuilder, private service: PromptService) {
    this.myForm = this.fb.group({
      query: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
   
  }

  onSubmit(formDirective: FormGroupDirective) {
    this.submitFlag = true;
    this.loaderFlag = true;
    this.approvedPosts = [];
    this.service.getAnswers(this.myForm.value).subscribe((res) => {
      console.log("res--", res);
      this.approvedPosts  = res.approved_posts;
      this.submitFlag = false;
      this.loaderFlag = false;
      formDirective.resetForm();  // Clears the <mat-error> messages
      this.myForm.reset();
    },
      (error) => {
        console.error('Get answer failed', error);
        this.approvedPosts = []
        this.submitFlag = false;
        this.loaderFlag = false; 
        formDirective.resetForm();  // Clears the <mat-error> messages
        this.myForm.reset(); 
      }
    )
  }

  // downloadPost(post: any) {
  //   const element = document.createElement('a');
  //   const file = new Blob([post.post.join('\n')], { type: 'text/plain' });
  //   element.href = URL.createObjectURL(file);
  //   element.download = 'post.txt';
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);

  //   post.images.forEach((image: string, index: number) => {
  //     const imgElement = document.createElement('a');
  //     imgElement.href = 'data:image/jpeg;base64,' + image;
  //     imgElement.download = `image_${index + 1}.jpg`;
  //     document.body.appendChild(imgElement);
  //     imgElement.click();
  //     document.body.removeChild(imgElement);
  //   });
  // }

  downloadPost(post: any) {
    const zip = new JSZip();
  
    // Add the text content to the zip file
    const postText = post.post.join('\n').replace(/\/\*.*?\*\//g, '').replace(/\n/g, '\n');
    zip.file('post.txt', postText);
  
    // Process images
    post.images.forEach((image: string, index: number) => {
      try {  
        // Convert base64 to binary data
        const binaryData = atob(image);
  
        // Create a Uint8Array for the binary data
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
  
        // Add the image to the zip file
        zip.file(`image_${index + 1}.jpg`, byteArray, { binary: true });
      } catch (error : any) {
        console.error(`Error processing image at index ${index}:`, error.message);
      }
    });
  
    // Generate the zip file and trigger download
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'post.zip');
    });
  }

  formatPostText(text: string): string {
    return text.replace(/\*\*/g, '').replace(/\n/g, '<br>');
  }
}